import { Request, Response, NextFunction } from "express"
import { User } from "../entities/User"
import { HttpException } from "../utils/errorUtils"
import bcrypt from "bcrypt"
import {
  cookieOptions,
  createAccessToken,
  createRefreshToken,
  ValidatedTokenPayload,
  validateToken,
} from "../utils/authUtils"

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
    // TODO: ?-return error or return as 200 status w/ success false
    next(new HttpException(400, "Username and password combination is not valid. Please try again"))
  } else {
    // validate password with hash
    const passResults: boolean = await bcrypt.compare(password, user.password)
    if (passResults) {
      // Create JWT tokens
      const accessToken: string = createAccessToken(user)
      const refreshToken: string = createRefreshToken(user)
      res.cookie("refreshToken", refreshToken, cookieOptions)
      res.json({ success: true, accessToken })
    } else {
      // TODO: ?-return error or return as 200 status w/ success false
      next(new HttpException(400, "Username and password combination is not valid. Please try again"))
    }
  }
}

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("refreshToken")
  res.json({ success: true })
}

export const getMeUser = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore - user property added my auth middleware
  const { id, email } = req.user
  const user = await User.findOne({ id, email })
  if (user) {
    res.json(user)
  } else {
    next(new HttpException(401, "Unauthorized"))
  }
}

// TODO: Add fingerprint to tokens and persist in database to keep sessions validity.
//  Use this to invalidate tokens/ fingerprint session id on log out, user using login
//  functionality, and on refresh reissue below to prevent reuse of tokens by malicious actors
export const refreshTokens = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies
  if (cookies && cookies.refreshToken) {
    const refreshToken = cookies.refreshToken
    const refreshTokenPayload: ValidatedTokenPayload = await validateToken(refreshToken)
    if (refreshTokenPayload.isValid) {
      // @ts-ignore
      const { id, email } = refreshTokenPayload.payload
      const user = await User.findOne({ id, email })
      if (user) {
        const accessToken: string = createAccessToken(user)
        const refreshToken: string = createRefreshToken(user)
        res.cookie("refreshToken", refreshToken, cookieOptions)
        res.json({ success: true, accessToken })
      } else {
        res.clearCookie("refreshToken")
        next(new HttpException(401, "Unauthorized"))
      }
    } else {
      res.clearCookie("refreshToken")
      next(new HttpException(401, "Unauthorized"))
    }
  } else {
    next(new HttpException(401, "Unauthorized"))
  }
}
