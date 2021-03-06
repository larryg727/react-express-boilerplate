import { config } from "dotenv"
config()
import "reflect-metadata"
import { createConnection } from "typeorm"
import express from "express"
import apiRouter from "./routes"
import { errorMiddleware } from "./middleware/errorMiddleware"
import { authMiddleware } from "./middleware/authMiddleware"
import cookieParser from "cookie-parser"

const PORT = process.env.PORT || 3000

// Create Database connection
createConnection()
  .then(connection => {
    // Setup express
    const app = express()
    // Add parser middleware
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    // Add cookie parser middleware
    app.use(cookieParser())
    // Attach auth middleware
    app.use(authMiddleware)
    // Attach api routes to app
    app.use("/api", apiRouter)
    // Attach error handler middleware
    app.use(errorMiddleware)
    // Start server and listen for requests
    app.listen(PORT, () => {
      const dbStatus = connection.isConnected ? "connected" : "NOT connected"
      console.log(`The database is ${dbStatus} and the api is listening on port ${PORT}.`)
    })
  })
  .catch(error => console.log(error))
