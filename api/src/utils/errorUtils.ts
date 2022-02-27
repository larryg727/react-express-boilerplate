import { ValidationError } from "class-validator"
import { NextFunction } from "express"

export class HttpException extends Error {
  status: number
  message: string
  constructor(status?: number, message?: string) {
    const defaultMessage = "Something went wrong"
    super(message || defaultMessage)
    this.status = status || 500
    this.message = message || defaultMessage
  }
}

export interface FieldErrors {
  [field: string]: string
}

export class ValidationException extends HttpException {
  fieldErrors: FieldErrors
  constructor(errors: FieldErrors) {
    super(400, "There are errors in your form")
    this.fieldErrors = errors
  }
}

export const handleValidationErrors = (errors: ValidationError[], next: NextFunction) => {
  const fieldErrors: FieldErrors = {}
  errors.forEach(error => {
    // @ts-ignore
    fieldErrors[error.property] = Object.values(error.constraints)
  })
  next(new ValidationException(fieldErrors))
}
