import { Request, Response } from 'express'
import UserRepository from '../repositories/user.repository'
import { Error } from 'sequelize'

export default class UserController {
  async create(req: Request, res: Response) {
    const payload = req.body

    try {
      const result = await UserRepository.save(payload)

      return res.status(200).send(result)
    } catch (err) {
      if (err instanceof Error && err.name === 'SequelizeUniqueConstraintError') {
        console.log(err.message)
        return res.status(409).json({
          message: 'User already exists'
        })
      }
      return res.status(500).json(err)
    }
  }

  async update(req: Request, res: Response) {
    // const payload = req.params
    // const result = await UserRepository.update(payload)
    return res.status(201).send('user updated')
  }

  async findAll(req: Request, res: Response) {
    const filters: string = req.params.fullName as string
    const results = await UserRepository.retrieveAll({ fullName: filters })
    return res.status(200).send(results)
  }

  async findById(req: Request, res: Response) {
    const id = Number(req.params.id)
    const result = await UserRepository.retrieveById(id)
    return res.status(200).send(result)
  }

  async deleteById(req: Request, res: Response) {
    const id = Number(req.params.id)
    const result = await UserRepository.delete(id)
    return res.status(204).send({
      success: result
    })
  }

  async deleteAll(req: Request, res: Response) {
    const result = await UserRepository.deleteAll()
    return res.status(204).send({
      success: result
    })
  }

  async findByMail(req: Request, res: Response) {
    const email = req.params.email
    const result = await UserRepository.retrieveByMail(email)
    return res.status(200).send(result)
  }

  async findByPhone(req: Request, res: Response) {
    const phone = req.params.phone
    const result = await UserRepository.retrieveByPhone(phone)
    return res.status(200).send(result)
  }

  async findByUsername(req: Request, res: Response) {
    const username = req.params.username
    const result = await UserRepository.retrieveByUsername(username)
    return res.status(200).send(result)
  }
}
