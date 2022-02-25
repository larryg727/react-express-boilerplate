import jwt, { JwtPayload } from "jsonwebtoken"
import { User } from "../entities/User"

const JWT_SECRET: string = process.env.JWT_SECRET || "shhhh"

const ACCESS_TTL: number = 60 * 10 // 10 min
const REFRESH_TTL: number = 60 * 60 * 10 // 10 hours

export interface TokenPayload extends JwtPayload {
  id: number
  email: string
  firstName: string
  lastName: string
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
    firstName: user.firstName,
    lastName: user.lastName,
  }
}

interface ValidatedTokenPayload {
  isValid: boolean
  user?: User
  error?: string
}

export const validateToken = async (token: string) => {
  const results: ValidatedTokenPayload = { isValid: false }
  jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }, async (err, decode) => {
    if (err) {
      console.log(err)
      results.error = err.message
      // TODO better way to handle error
    } else {
      // @ts-ignore
      const { id, email, firstName, lastName } = decode
      const user = await User.findOne({ id, email, firstName, lastName })
      results.isValid = true
      results.user = user
    }
  })
  return results
}
