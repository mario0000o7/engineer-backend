import { Router } from 'express'
import UserController from '../controller/user.controller'
import { passwordMiddleware } from '../middlewares/passwordMiddleware'

class UserRoutes {
  router = Router()
  public userController: UserController = new UserController()

  constructor() {
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.post('/register', passwordMiddleware, this.userController.register)
    this.router.post('/login', this.userController.login)
    this.router.post('/checkEmail', this.userController.findByMail)
  }
}

export default new UserRoutes().router
