import User from '../models/user.model'
import jwt from 'jsonwebtoken'

export function generateTokenJwt(user: User) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.TOKEN_SECRET as string,
    { expiresIn: '30d' }
  )
}

export function verifyTokenJwt(token: string) {
  return jwt.verify(token, process.env.TOKEN_SECRET as string)
}
