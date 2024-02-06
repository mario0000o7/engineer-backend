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
    this.router.get('/readAll', this.appointmentController.retrieveAll)
    this.router.get('/readById', this.appointmentController.retrieveById)
    this.router.put('/update', this.appointmentController.update)
    this.router.delete('/delete', this.appointmentController.delete)
    this.router.get('/readAvailableDatesForService', this.appointmentController.readAvailableDatesForService)
    this.router.get('/getAppointmentsByUserId', this.appointmentController.getAppointmentsForUser)
    this.router.get('/getAppointmentsByDoctorId', this.appointmentController.getAppointmentsForDoctor)
    this.router.put('/moveAppointment', this.appointmentController.moveAppointment)
  }
}

export default new AppointmentRoutes().router
