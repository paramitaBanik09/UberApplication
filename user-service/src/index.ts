import express from "express"
import {config} from "./config"

const {server_config} = config
const {PORT} = server_config

const server = express()

server.listen(PORT,()=>{
    console.log("Server running at",PORT)
})