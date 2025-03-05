import env from "dotenv"
import { Request, Response } from "express"
import mongoose from "mongoose"

export async function dbConnectivity(){
    env.config()
    const dbURL=process.env.MONGODB_URL!
    try {
        await mongoose.connect(dbURL)
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Connection failed with this error:",error)
    }
}