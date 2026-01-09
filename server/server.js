const express = require('express')
require('dotenv').config()
const colors = require('colors')
const cors = require('cors')
const connectDB = require('./config/dbConfig')

const PORT = process.env.PORT || 5000
const app = express()

// connectDB
connectDB()

app.use(express.json())
app.use(express.urlencoded())


app.use("/api/auth", require("./routes/authRoute"))

// Home 
// app.use("/", (req , res) => {
// res.json({
//     msg:"Welcome To my task"
// })
// })



app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING AT : ${PORT}`.bgMagenta.white)
})