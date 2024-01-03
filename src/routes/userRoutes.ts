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
    this.router.post('/checkPhone', this.userController.findByPhone)
    this.router.post('/findUser', this.userController.findAll)
    this.router.post('/getAllUser', this.userController.getAllUsers)
    this.router.post('/getUserByIds', this.userController.findByIds)
    this.router.post('/update', this.userController.update)
  }
}

export default new UserRoutes().router
