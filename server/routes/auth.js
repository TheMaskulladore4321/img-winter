const express = require("express")
const router = express.Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

router.post("/register", async (req, res) => {
    console.log('headers', req.headers);
    console.log('body', req.body);
    const {email, password, displayName} = req.body

    if (!email || !password || !displayName)
    {
        return res.status(400).json({message: "Missing Fields"})
    }

    const existingUser = await User.findOne({email})
    if (existingUser)
    {
        return res.status(400).json({message: "Email already in use"})
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await User.create({
        email,
        passwordHash,
        displayName,
    })

    res.status(201).json({
        id: user._id,
        email: user.email,
        displayName: user.displayName
    })
})



router.post("/login", async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})

    if (!user) {
    return res.status(400).json({ message: "Invalid credentials" })
    }

    const isValid = bcrypt.compare(password, user.passwordHash)

    if (!user) {
    return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})
    
    res.json({
        token,
        user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        }
    })
})
module.exports = router