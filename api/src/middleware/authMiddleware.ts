import { ValidatedTokenPayload, validateToken } from "../utils/authUtils"
import { NextFunction, Request, Response } from "express"
import { TokenExpiredError } from "jsonwebtoken"
import { HttpException } from "../utils/errorUtils"

const WHITELIST_PATHS = [
  "/api/version", // Version & Health check endpoint
  "/api/user/register", // To register new user
  "/api/auth/login", // Login path
  "/api/auth/refresh", // used to refresh authentication tokens
]

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  if (WHITELIST_PATHS.includes(request.path)) {
    next()
  } else {
    const bearerToken: string | undefined = request.header("authorization")
    if (bearerToken) {
      const accessToken = bearerToken.split(" ")[1]
      const tokenPayload: ValidatedTokenPayload = await validateToken(accessToken)
      if (tokenPayload.isValid) {
        Object.assign(request, { user: tokenPayload.payload })
        next()
      } else {
        next(new HttpException(401, "Unauthorized"))
      }
    } else {
      next(new HttpException(401, "Unauthorized"))
    }
  }
}
