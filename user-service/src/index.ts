import express from "express"
import { config } from "./config"
import { apiRouter } from "./routes"

const { server_config } = config
const { PORT } = server_config

const server = express()
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use("/api", apiRouter)

server.listen(PORT, () => {
    console.log("Server running at", PORT)
})