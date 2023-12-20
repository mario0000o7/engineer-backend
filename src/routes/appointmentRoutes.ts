import { Router } from 'express'
import AppointmentController from '../controller/appointment.controller'

class AppointmentRoutes {
  public router: Router = Router()
  public appointmentController: AppointmentController = new AppointmentController()

  constructor() {
    this.initializeRoutes()
  }

  initializeRoutes(): void {
    this.router.post('/create', this.appointmentController.create)
    this.router.post('/readAll', this.appointmentController.retrieveAll)
    this.router.post('/readById', this.appointmentController.retrieveById)
    this.router.post('/update', this.appointmentController.update)
    this.router.post('/delete', this.appointmentController.delete)
    this.router.post('/readAvailableDatesForService', this.appointmentController.readAvailableDatesForService)
  }
}

export default new AppointmentRoutes().router
