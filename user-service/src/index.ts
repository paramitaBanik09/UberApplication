import express, { request, response } from "express"
import { config } from "./config"
import { apiRouter } from "./routes"
import { dbConnectivity } from "./database/connection"


const { server_config } = config
const { PORT } = server_config

const server = express()

await dbConnectivity()

server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use("/api", apiRouter)


server.listen(PORT, () => {
    console.log("Server running at", PORT)
})