import { Request, Response, NextFunction } from "express"
import { HttpException, ValidationException } from "../utils/errorUtils"

export const errorMiddleware = (
  error: HttpException | ValidationException,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { status, message } = error
  const errors = error instanceof ValidationException ? error.errors : []
  response.status(status).send({ status, message, errors })
}
