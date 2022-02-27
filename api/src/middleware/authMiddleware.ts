import { ValidatedTokenPayload, validateToken } from "../utils/authUtils"
import { NextFunction, Request, Response } from "express"
import { TokenExpiredError } from "jsonwebtoken"
import { HttpException } from "../utils/errorUtils"

const WHITELIST_PATHS = ["/api/version", "/api/user/register", "/api/auth/login"]

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
      } else if (tokenPayload.error instanceof TokenExpiredError) {
        // Todo: check if cookie is set and refresh token is valid, then refresh tokens
        next(new HttpException(401, "token expired"))
      } else {
        next(new HttpException(401, "Unauthorized"))
      }
    }
  }
}
