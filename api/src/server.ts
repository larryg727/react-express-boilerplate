import { config } from "dotenv"
config()
import "reflect-metadata"
import { createConnection } from "typeorm"
import express from "express"

const VERSION = process.env.npm_package_version || "unknown"
const PORT = process.env.PORT || 3000

createConnection()
  .then(connection => {
    const app = express()

    app.get("/version", (req, res) => {
      res.send(`Running Version: ${VERSION}`)
    })

    app.listen(PORT, () => {
      const dbStatus = connection.isConnected ? "connected" : "NOT connected"
      console.log(`The database is ${dbStatus} and the api is listening on port ${PORT}.`)
    })
  })
  .catch(error => console.log(error))
