const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    displayName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    // age: {type: Number, required: true},
    bio: {type: String, default: ""},
    interests: [{type: String}]
}, {timestamps: true})

module.exports = mongoose.model("User", userSchema)