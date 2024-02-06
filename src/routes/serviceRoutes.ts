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
    this.router.get('/readAllOffices', this.serviceController.retrieveAll)
    this.router.put('/update', this.serviceController.update)
    this.router.delete('/delete', this.serviceController.delete)
    this.router.get('/retrieveAllByOfficeId', this.serviceController.retrieveAllByOfficeId)
  }
}

export default new ServiceRoutes().router
