const express = require("express")
const Circle = require("../models/Circle")
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/", auth, async (req, res) => {
    const {title, description, tags, visibility} = req.body

    if (!title)
    {
        return res.status(400).json({message: "Title is required"})
    }

    const userId = req.user.id

    const circle = await Circle.create({
        title,
        description,
        tags,
        visibility,
        owner: userId,
        members: [userId]
    })
    
    res.status(201).json(circle)
})

router.get("/", async (req, res) => {
  try {
    const circles = await Circle.find({ visibility: "public" })
    .populate("owner", "displayName")
    .sort({ createdAt: -1 })

    res.json(circles)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch circles" })
  }
})

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params

        const circle = await Circle.findOne({
            _id: id,
            visibility: "public",
        }).populate("owner", "displayName")

        if (!circle)
        {
            res.status(404).json({message: "Circle not found"})
        }

        if (circle.visibility === "public")
        {
            res.json(circle)
        }

        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer "))
        {
            return res.status(403).json({message: "Private circle"})
        }

        const token = authHeader.split(" ")[1]

        const decoded = require("jsonwebtoken").verify(token, process.env.JWT_SECRET)

        const userId = decoded.userId

        const isMember = circle.members.some(memberId => memberId.toString() === userId)

        if (!isMember) {
            return res.status(403).json({ message: "Private circle" })
        }

        res.json(circle)
    }
    catch (err)
    {
        res.status(400).json({message: "Invalid circle ID"})
    }

})

router.post("/:id/join", auth, async (req, res) => {
    const userId = req.user.id
    const { id: circleId } = req.params

    const circle = await Circle.findById(circleId)

    if (!circle)
    {
        return res.status(404).json({ message: "Circle not found" })
    }

    if (circle.members.includes(userId))
    {
        return res.status(400).json({ message: "Already a member" })
    }

    if (circle.visibility === "private") 
    {
        return res.status(403).json({ message: "Private circle" })
    }

    circle.members.push(userId)
    await circle.save()

    res.json({message: "Joined circle"})
})

router.post("/:id/leave", auth, async (req, res) => {
  const userId = req.user.id
  const { id: circleId } = req.params

  const circle = await Circle.findById(circleId)

  if (!circle) {
    return res.status(404).json({ message: "Circle not found" })
  }

  if (circle.owner.toString() === userId) {
    return res.status(400).json({ message: "Owner cannot leave circle" })
  }

  if (!circle.members.includes(userId)) {
    return res.status(400).json({ message: "Not a member" })
  }

  circle.members = circle.members.filter(
    memberId => memberId.toString() !== userId
  )

  await circle.save()

  res.json({ message: "Left circle" })
})

module.exports = router