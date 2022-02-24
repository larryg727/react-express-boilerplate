import { Request, Response, NextFunction } from "express"
import { User } from "../entities/User"
import { handleValidationErrors, HttpException } from "../utils/errorUtils"
import bcrypt from "bcrypt"

const SALT_ROUNDS = process.env.SALT || 10

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  // Retrieve login parameters from request
  const { email, password } = req.body
  // Get user with hashed password by email
  const user: User | undefined = await User.createQueryBuilder("user")
    .addSelect("user.password")
    .where("user.email = :email", { email })
    .getOne()
  // If no user found return login error
  console.log(user)
  if (!user) {
    // TODO: return error or return as 200 status w/ success false
    next(new HttpException(400, "Username and password combination is not valid. Please try again"))
  } else {
    // validate password with hash
    const passResults: boolean = await bcrypt.compare(password, user.password)
    if (passResults) {
      // TODO: create JWT tokens
      // TODO: create cookie
      // TODO: return success and tokens
      return res.json({ success: true })
    } else {
      // TODO: return error or return as 200 status w/ success false
      next(new HttpException(400, "Username and password combination is not valid. Please try again"))
    }
  }
}

// me controller to get authenticated user

// refresh controller to refresh JWT with refresh token
