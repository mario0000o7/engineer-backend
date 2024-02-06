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
    this.router.put('/update', this.dayOffController.update)
    this.router.delete('/delete', this.dayOffController.delete)
    this.router.get('/retrieveAllByOfficeId', this.dayOffController.retrieveAllByOfficeId)
    this.router.get('/retrieveById', this.dayOffController.retrieveById)
    this.router.get('/retrieveByUserId', this.dayOffController.retrieveByUserId)
  }
}

export default new DayOffRoutes().router
