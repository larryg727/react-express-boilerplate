import express from "express"
import { loginUser } from "../controllers/auth"

const router = express.Router()

// @desc    Login user
// @route   Post /api/auth/login
// @access  Public - for now....
router.post("/login", loginUser)

export default router
