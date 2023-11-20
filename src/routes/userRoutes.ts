import { Router } from 'express'
import UserController from '../controller/user.controller'

class UserRoutes {
  router = Router()
  public userController: UserController = new UserController()

  constructor() {
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.post('/register', this.userController.create)
    // this.router.post('/login', this.userController.login)
    this.router.post('/checkEmail', this.userController.findByMail)
  }
}

export default new UserRoutes().router
