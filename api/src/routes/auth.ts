import express from "express"
import { loginUser, getMeUser } from "../controllers/auth"

const router = express.Router()

// @desc    Login user
// @route   Post /api/auth/login
// @access  Public
router.post("/login", loginUser)
// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private
router.get("/me", getMeUser)

export default router
