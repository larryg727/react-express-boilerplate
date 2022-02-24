import express, { Request, Response } from "express"
import userRouter from "./user"
import authRouter from "./auth"

const router = express.Router()

const VERSION = process.env.npm_package_version || "unknown"
// @desc    Route for health and version checks
// @route   GET /api/version
// @access  Public
router.get("/version", (req: Request, res: Response) => {
  res.send(`Running Version: ${VERSION}`)
})

// All Routes in this directory must be imported above then attached to router here
router.use("/user", userRouter)
router.use("/auth", authRouter)

export default router
