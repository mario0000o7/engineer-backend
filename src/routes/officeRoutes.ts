import { Router } from 'express'

import OfficeController from '../controller/office.controller'

class OfficeRoutes {
  router = Router()
  public officeController: OfficeController = new OfficeController()

  constructor() {
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.post('/create', this.officeController.create)
    this.router.post('/update', this.officeController.update)
    this.router.post('/delete', this.officeController.delete)
    this.router.post('/retrieveAll', this.officeController.retrieveAll)
    this.router.post('/retrieveById', this.officeController.retrieveById)
    this.router.post('/retrieveByOwnerId', this.officeController.retrieveByOwnerId)
  }
}

export default new OfficeRoutes().router
