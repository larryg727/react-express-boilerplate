import { Request, Response, NextFunction } from "express"
import { FieldErrors, HttpException, ValidationException } from "../utils/errorUtils"

interface ErrorBody {
  status: number
  message: string
  fieldErrors?: FieldErrors
}

export const errorMiddleware = (
  error: HttpException | ValidationException,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let errorBody: ErrorBody = { status: error.status, message: error.message }
  if (error instanceof ValidationException) {
    errorBody.fieldErrors = error.fieldErrors
  }
  response.status(error.status).send(errorBody)
}
