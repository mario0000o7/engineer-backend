export function userMiddleware(req: any, res: any, next: () => void) {
  console.log(req.headers.authorization)
  //TODO: add auth middleware
  const token = req.headers?.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  next()
}
