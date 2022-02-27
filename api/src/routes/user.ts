import express from "express"
import { postSaveUser } from "../controllers/user"

const router = express.Router()

// @desc    Register new User
// @route   POST /api/user
// @access  Public
router.post("/", postSaveUser)

export default router
