import express from "express"
import { config } from "./config"
import { dbConnectivity } from "./database/connection"
import { errorHandeler } from "./middleware/error-handeler"
import { apiRouter } from "./routes"


const { server_config,logger } = config
const { PORT } = server_config

const server = express()

await dbConnectivity()

server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(errorHandeler)
server.use("/api", apiRouter)

server.listen(PORT, () => {
     logger.debug(`Server is running on port ${PORT}`)
})  