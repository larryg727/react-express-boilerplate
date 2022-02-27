import express from "express"
import { loginUser, getMeUser, refreshTokens, logoutUser } from "../controllers/auth"

const router = express.Router()

// @desc    Login user
// @route   Post /api/auth/login
// @access  Public
router.post("/login", loginUser)
// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private
router.get("/me", getMeUser)
// @desc    Refresh tokens
// @route   GET /api/auth/refresh
// @access  Private
router.get("/refresh", refreshTokens)
// @desc    Logout user
// @route   Get /api/auth/logout
// @access  Private
router.get("/logout", logoutUser)

export default router
