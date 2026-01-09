const mongoose = require('mongoose')

 const connectDB  = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`DB CONNECTION SUCCESS:${conn.connection.name}`.bgCyan.white)
    } catch (error) {
        console.log(`DB CONNECTION FAILED: ${error.message}`.bgGreen.white)
    }
 }

 module.exports = connectDB