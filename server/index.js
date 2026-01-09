const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const app = express()
const authRoutes = require("./routes/auth")
const circleRoutes = require("./routes/circles")

app.use(cors())
app.use(express.json())
app.use("/auth", authRoutes)
app.use("/circles", circleRoutes)

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))

app.listen(5000, () => {
  console.log("Server running on port 5000")
})
