import { Request, Response } from 'express'
import UserRepository from '../repositories/user.repository'
import { DataBaseError } from './user.controller.types'
import bcrypt from 'bcrypt'
import { generateTokenJwt } from '../services/authService'

export default class UserController {
  async register(req: Request, res: Response) {
    const payload = req.body

    try {
      const result = await UserRepository.save(payload)
      const jwtToken = generateTokenJwt(result)

      return res.status(200).send({
        token: jwtToken
      })
    } catch (err) {
      const error = err as DataBaseError
      switch (error.errors![0].message) {
        case 'username must be unique':
          return res.status(400).send('username already exists')
        case 'phone must be unique':
          return res.status(400).send('phone already exists')
        case 'email must be unique':
          return res.status(400).send('email already exists')
        case 'uuid must be unique':
          return res.status(400).send('uuid already exists')
        default: {
          console.log(err)
          return res.status(500).send('something went wrong')
        }
      }
    }
  }

  async login(req: Request, res: Response) {
    const payload = req.body
    let result
    try {
      result = await UserRepository.retrieveByMail(payload.email)
    } catch (err) {
      return res.status(400).send('invalid credentials')
    }
    if (result === null) {
      return res.status(400).send('user not found')
    }
    let isMatch = false
    try {
      isMatch = bcrypt.compareSync(payload.password, result.password)
    } catch (err) {
      return res.status(400).send('invalid credentials')
    }

    if (!isMatch) {
      return res.status(400).send('invalid credentials')
    }
    const jwtToken = generateTokenJwt(result)
    return res.status(200).send({
      token: jwtToken
    })
  }

  async update(req: Request, res: Response) {
    // const payload = req.params
    // const result = await UserRepository.update(payload)
    return res.status(201).send('user updated')
  }

  async findAll(req: Request, res: Response) {
    const filters: string = req.body.fullName as string
    const results = await UserRepository.retrieveAll({ fullName: filters })
    return res.status(200).send(results)
  }

  async findById(req: Request, res: Response) {
    const id = Number(req.body.id)
    const result = await UserRepository.retrieveById(id)
    return res.status(200).send(result)
  }

  async deleteById(req: Request, res: Response) {
    const id = Number(req.body.id)
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
    try {
      const email = req.body.email

      const result = await UserRepository.retrieveByMail(email)
      return res.status(200).send({ userExists: result !== null })
    } catch (err) {
      return res.status(400).send('invalid email')
    }
  }

  async findByPhone(req: Request, res: Response) {
    try {
      const phone = req.body.phone

      const result = await UserRepository.retrieveByPhone(phone)
      return res.status(200).send({ userExists: result !== null })
    } catch (err) {
      return res.status(400).send('invalid phone')
    }
  }
}
