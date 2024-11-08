import { NextFunction, Request, Response } from 'express'
import { verifyTokenJwt } from '../services/authService'

export function userMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(req.headers.authorization)
  const token = req.headers?.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }
  const verified = verifyTokenJwt(token)
  if (!verified) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  return next()
}
