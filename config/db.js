const mongoose=require('mongoose')
const env=require('dotenv')
env.config()
const config = require('./config')
const mongodb_url=process.env.MONGODB_URL || config.mongodb.url;


const db=async()=>{
    try {
        const con=await mongoose.connect(mongodb_url);
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.error("MongoDB connection error:", error.message)
        process.exit(1)
    }
}
module.exports=db