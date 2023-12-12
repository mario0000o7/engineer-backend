import { Application } from 'express'
import userRoutes from './userRoutes'
import officeRoutes from './officeRoutes'

export default class Routes {
  constructor(app: Application) {
    app.use('/api/user', userRoutes)
    app.use('/api/office', officeRoutes)
  }
}
