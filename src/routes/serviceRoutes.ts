import ServiceController from '../controller/service.controller'
import { Router } from 'express'

class ServiceRoutes {
  router = Router()
  public serviceController: ServiceController = new ServiceController()

  constructor() {
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.post('/create', this.serviceController.create)
    this.router.post('/readAllOffices', this.serviceController.retrieveAll)
    this.router.post('/update', this.serviceController.update)
    this.router.post('/delete', this.serviceController.delete)
    this.router.post('/retrieveAllByOfficeId', this.serviceController.retrieveAllByOfficeId)
  }
}

export default new ServiceRoutes().router
