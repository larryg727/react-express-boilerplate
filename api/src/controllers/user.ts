import { Request, Response, NextFunction } from "express"
import { User } from "../entities/User"
import { validate } from "class-validator"
import { handleValidationErrors, HttpException } from "../utils/errorUtils"

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const user = await User.findOne(id)
  if (user) res.json(user)
  else next(new HttpException(400, "User not found"))
}

export const postSaveUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, firstName, lastName, password } = req.body

  const user = new User()
  user.email = email
  user.firstName = firstName
  user.lastName = lastName
  // // TODO add encryption to hash password
  user.password = password

  const errors = await validate(user)
  if (errors.length > 0) {
    handleValidationErrors(errors, next)
  } else {
    try {
      await User.save(user)
      res.send({ id: user.id, email, firstName, lastName })
    } catch (e) {
      console.log(e)
      next(new HttpException())
    }
  }
}
