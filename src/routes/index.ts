import { Application } from 'express'
import userRoutes from './userRoutes'
import officeRoutes from './officeRoutes'
import serviceRoutes from './serviceRoutes'
import appointmentRoutes from './appointmentRoutes'

export default class Routes {
  constructor(app: Application) {
    app.use('/api/user', userRoutes)
    app.use('/api/office', officeRoutes)
    app.use('/api/service', serviceRoutes)
    app.use('/api/appointment', appointmentRoutes)
  }
}
