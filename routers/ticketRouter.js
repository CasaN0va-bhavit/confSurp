const router = require('express').Router()
const User = require('../schemas/userSchema')
const stripe = require('stripe')(process.env.STRIPE_SECRET)

router.get('/', (req, res) => {
    res.render('ticket')
})

router.post('/', async (req, res) => {
    const {tickets, singer} = req.body
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: process.env.PRICE_ID,
            quantity: Number(tickets),
          },
        ],
        mode: 'payment',
        success_url: `https://conf-surp.onrender.com/success`,
        cancel_url: `https://conf-surp.onrender.com/`,
      });
    await User.findOneAndUpdate({username: req.user.username}, {
        $set: {
            tickets: tickets,
            singer: singer
        }
    })
    console.log(await User.find({}))
    res.redirect(303, session.url)
})

module.exports = router