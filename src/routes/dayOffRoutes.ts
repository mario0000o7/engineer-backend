import { Router } from 'express'

import DayOffController from '../controller/dayOff.controller'

class DayOffRoutes {
  router = Router()
  public dayOffController: DayOffController = new DayOffController()

  constructor() {
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.post('/create', this.dayOffController.create)
    this.router.post('/update', this.dayOffController.update)
    this.router.post('/delete', this.dayOffController.delete)
    this.router.post('/retrieveAllByOfficeId', this.dayOffController.retrieveAllByOfficeId)
    this.router.post('/retrieveById', this.dayOffController.retrieveById)
    this.router.post('/retrieveByUserId', this.dayOffController.retrieveByUserId)
  }
}

export default new DayOffRoutes().router
