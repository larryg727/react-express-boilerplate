import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken"
import { User } from "../entities/User"

const JWT_SECRET: string = process.env.JWT_SECRET || "shhhh"

const ACCESS_TTL: number = 60 * 10 // 10 min
const REFRESH_TTL: number = 60 * 60 * 10 // 10 hours

export interface TokenPayload {
  id: number
  email: string
}

export interface ValidatedTokenPayload {
  isValid: boolean
  payload?: TokenPayload | JwtPayload | string
  error?: VerifyErrors
}

export const createAccessToken = (user: User) => {
  const tokenPayload: TokenPayload = generatePayload(user)
  return signToken(tokenPayload, ACCESS_TTL)
}

export const createRefreshToken = (user: User) => {
  const tokenPayload: TokenPayload = generatePayload(user)
  return signToken(tokenPayload, REFRESH_TTL)
}

const signToken = (payload: TokenPayload, ttl: number) => {
  return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: ttl })
}

const generatePayload = (user: User) => {
  return {
    id: user.id,
    email: user.email,
  }
}

export const validateToken = async (token: string) => {
  const results: ValidatedTokenPayload = { isValid: false }
  jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }, async (err, decode) => {
    if (err) {
      results.error = err
    } else {
      results.isValid = true
      results.payload = decode
    }
  })
  return results
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  secure: process.env.environment === "production",
  maxAge: REFRESH_TTL,
}
