require('dotenv').config()

const express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    app = express(),
    flash = require('express-flash'),
    session = require('cookie-session'),
    PORT = process.env.PORT || 5000,
    passportInit = require('./utils/passport-config'),
    {ensureAuthenticated, forwardAuthenticated} = require('./utils/authenticate')

const indexRouter = require('./routers/indexRouter'),
    regRouter = require('./routers/regRouter'),
    loginRouter = require('./routers/loginRouter'),
    ticketRouter = require('./routers/ticketRouter');

mongoose.connect(process.env.MONGO_URI, console.log('MONGODB CONNECTED'))

app.use(express.static('public'))
app.use('/', express.static('public'))
app.use(express.static('uploads'))
app.use('/', express.static('uploads'))
app.set('view engine', 'ejs')
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use(express.urlencoded({extended: false}))
app.use(express.json({limit: '1mb'}))

app.use(passport.initialize())
app.use(passport.session())
passportInit(passport)

app.use('/', indexRouter)
app.use('/login', forwardAuthenticated, loginRouter)
app.use('/register', forwardAuthenticated, regRouter)
app.use('/ticket', ensureAuthenticated, ticketRouter)
app.get('/success', (req, res) => {
    res.render('success')
})
app.get('/view', ensureAuthenticated, (req, res) => {
    if (!req.user.tickets) return res.redirect('/ticket');
    res.render('view', {user: req.user})
})

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

app.use((req, res, next) => {
    res.status(404).render('notfound', {user: req.user})
})

app.listen(PORT, console.log(`SERVER CONNECTED ON PORT ${PORT}`))