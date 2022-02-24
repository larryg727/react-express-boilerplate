import { Request, Response, NextFunction } from "express"
import { User } from "../entities/User"
import { validate } from "class-validator"
import { handleValidationErrors, HttpException } from "../utils/errorUtils"
import bcrypt from "bcrypt"

const SALT_ROUNDS = process.env.SALT || 10

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const user = await User.findOne(id)
  if (user) res.json(user)
  else next(new HttpException(400, "User not found"))
}

export const postSaveUser = async (req: Request, res: Response, next: NextFunction) => {
  // Retrieve user parameters from request
  const { email, firstName, lastName, password } = req.body
  // Build user object
  const user = new User()
  user.email = email
  user.firstName = firstName
  user.lastName = lastName
  // Hash password
  user.password = await bcrypt.hash(password, SALT_ROUNDS)
  // Validate user object
  const errors = await validate(user)
  // If errors handle
  if (errors.length > 0) {
    handleValidationErrors(errors, next)
  } else {
    // else save user
    try {
      await User.save(user)
      res.send({ id: user.id, email, firstName, lastName })
    } catch (e) {
      console.log(e)
      next(new HttpException())
    }
  }
}
