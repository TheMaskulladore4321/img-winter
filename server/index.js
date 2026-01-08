const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const app = express()
const authRoutes = require("./routes/auth")

app.use(cors())
app.use(express.json())
app.use("/auth", authRoutes)

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))

app.listen(5000, () => {
  console.log("Server running on port 5000")
})
