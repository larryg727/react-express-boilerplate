import express from "express"
import { getUserById, postSaveUser } from "../controllers/user"

const router = express.Router()

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Public - for now....
router.get("/:id", getUserById)
// @desc    Save new User
// @route   POST /api/users/
// @access  Public - for now....
router.post("/", postSaveUser)

export default router
