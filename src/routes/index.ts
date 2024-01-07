import { Application } from 'express'
import userRoutes from './userRoutes'
import officeRoutes from './officeRoutes'
import serviceRoutes from './serviceRoutes'
import appointmentRoutes from './appointmentRoutes'
import dayOffRoutes from './dayOffRoutes'
import { userMiddleware } from '../middlewares/userMiddleware'

export default class Routes {
  constructor(app: Application) {
    app.use('/api/user', userRoutes)
    app.use('/api/office', userMiddleware, officeRoutes)
    app.use('/api/service', userMiddleware, serviceRoutes)
    app.use('/api/appointment', userMiddleware, appointmentRoutes)
    app.use('/api/dayOff', userMiddleware, dayOffRoutes)
  }
}
