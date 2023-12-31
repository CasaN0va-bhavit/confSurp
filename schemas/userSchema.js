const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };
const nonReqString = { type: String, required: false };

const userSchema = new Schema(
    {
        username: reqString,
        fname: reqString,
        lname: reqString,
        password: reqString,
        dateCreated: {
            type: Date,
            required: true,
            default: Date.now
        },
        tickets: {
            type: Number,
            required: true,
            default: 0
        },
        singer: nonReqString
    }
);

module.exports = mongoose.model("user", userSchema);