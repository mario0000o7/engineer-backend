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
    this.router.put('/update', this.officeController.update)
    this.router.delete('/delete', this.officeController.delete)
    this.router.get('/retrieveAll', this.officeController.retrieveAll)
    this.router.get('/retrieveById', this.officeController.retrieveById)
    this.router.get('/retrieveByOwnerId', this.officeController.retrieveByOwnerId)
  }
}

export default new OfficeRoutes().router
