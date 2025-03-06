import env from "dotenv"
import mongoose from "mongoose"
import { config } from "../config"
const { server_config } = config
const { MONGO_URI } = server_config
env.config()
export async function dbConnectivity() {
    const dbURL = MONGO_URI
    try {
        await mongoose.connect(dbURL)
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Connection failed with this error:", error)
    }
}