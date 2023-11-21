import { ValidationErrorItem } from 'sequelize'

export interface DataBaseError extends Error {
  name: string
  message: string
  stack?: string
  errors?: ValidationErrorItem[]
}
