import { Router } from 'express'
import UserController from '../controller/user.controller'
import { passwordMiddleware } from '../middlewares/passwordMiddleware'
import { userMiddleware } from '../middlewares/userMiddleware'

class UserRoutes {
  router = Router()
  public userController: UserController = new UserController()

  constructor() {
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.post('/register', passwordMiddleware, this.userController.register)
    this.router.post('/login', this.userController.login)
    this.router.get('/checkEmail', this.userController.findByMail)
    this.router.get('/checkPhone', this.userController.findByPhone)
    this.router.get('/findUser', userMiddleware, this.userController.findAll)
    this.router.get('/getAllUser', userMiddleware, this.userController.getAllUsers)
    this.router.get('/getUserByIds', userMiddleware, this.userController.findByIds)
    this.router.put('/update', userMiddleware, this.userController.update)
    this.router.post('/sendSMS', this.userController.sendSMS)
    this.router.post('/verifySMS', this.userController.checkVerification)
  }
}

export default new UserRoutes().router
