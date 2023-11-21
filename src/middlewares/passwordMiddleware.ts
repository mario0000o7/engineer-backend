import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'

export function passwordMiddleware(req: Request, res: Response, next: NextFunction) {
  const { password } = req.body
  if (password) {
    req.body.password = bcrypt.hashSync(password, 10)
  }
  next()
}
