import { Request, Response, NextFunction } from "express"
import { User } from "../entities/User"
import { HttpException } from "../utils/errorUtils"
import bcrypt from "bcrypt"
import { createAccessToken, createRefreshToken } from "../utils/authUtils"

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  // Retrieve login parameters from request
  const { email, password } = req.body
  // Get user with hashed password by email
  const user: User | undefined = await User.createQueryBuilder("user")
    .addSelect("user.password")
    .where("user.email = :email", { email })
    .getOne()
  // If no user found return login error
  if (!user) {
    // TODO: return error or return as 200 status w/ success false
    next(new HttpException(400, "Username and password combination is not valid. Please try again"))
  } else {
    // validate password with hash
    const passResults: boolean = await bcrypt.compare(password, user.password)
    if (passResults) {
      // Create JWT tokens
      const accessToken: string = createAccessToken(user)
      const refreshToken: string = createRefreshToken(user)
      // TODO: create cookie and put refresh token in it
      // TODO: return success and token
      return res.json({ success: true, accessToken })
    } else {
      // TODO: return error or return as 200 status w/ success false
      next(new HttpException(400, "Username and password combination is not valid. Please try again"))
    }
  }
}

// me controller to get authenticated user

// refresh controller to refresh JWT with refresh token
