const mongoose = require("mongoose");

const circleSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    tags: [{type: String}],
    visibility: {type: String, required: true, enum: ['public', 'private'], default: 'public', lowercase: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    members: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
}, {timestamps: true})

module.exports = mongoose.model('Circle', circleSchema);