import { Request, Response } from 'express'
import UserRepository from '../repositories/user.repository'
import { DataBaseError } from './user.controller.types'
import bcrypt from 'bcrypt'
import { generateTokenJwt } from '../services/authService'
import User from '../models/user.model'
import * as process from 'process'
import axios from 'axios'
import qs from 'qs'

export default class UserController {
  async register(req: Request, res: Response) {
    const payload = req.body

    try {
      const result = await UserRepository.save(payload)
      const jwtToken = generateTokenJwt(result)
      // const user = new CometChat.User(result.id)
      // if (parseInt(result.role) === 1) {
      //   user.setRole('doktor')
      // }
      // if (parseInt(result.role) === 2) {
      //   user.setRole('pacjent')
      // }
      // user.setName(result.email)
      // await CometChat.createUser(user, process.env.AUTH_KEY_COSMO_CHAT!).then(
      //   (user: CometChat.User) => {
      //     console.log('user created', user)
      //   },
      //   (error: CometChat.CometChatException) => {
      //     console.log('error', error)
      //     throw error
      //   }
      // )

      return res.status(200).send({
        token: jwtToken
      })
    } catch (err) {
      const error = err as DataBaseError
      try {
        switch (error.errors![0].message) {
          case 'username must be unique':
            return res.status(400).send('username already exists')
          case 'phone must be unique':
            return res.status(400).send('phone already exists')
          case 'email must be unique':
            return res.status(400).send('email already exists')
          default: {
            console.log(err)
            return res.status(500).send('something went wrong')
          }
        }
      } catch (err) {
        console.log(err)
        return res.status(500).send('something went wrong')
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
    const payload = req.body
    try {
      console.log('password', payload.password)
      if (payload.password) {
        payload.password = bcrypt.hashSync(payload.password, 10)
      }
      const result = await UserRepository.update(payload)
      return res.status(200).send(result.toString())
    } catch (err) {
      console.log('Update error')
      console.log(err)
      return res.status(400).send('something went wrong')
    }
  }

  async findAll(req: Request, res: Response) {
    const filters: string = req.query.fullName as string
    const role = req.query.role as string
    let results
    try {
      results = await UserRepository.retrieveAll({ fullName: filters, role: parseInt(role) })
    } catch (err) {
      return res.status(400).send('invalid filters')
    }
    return res.status(200).send(results)
  }

  async getAllUsers(req: Request, res: Response) {
    const role = req.query.role as string
    let results
    try {
      results = await UserRepository.retrieveAllByRole(parseInt(role))
    } catch (err) {
      return res.status(400).send('invalid filters')
    }
    return res.status(200).send(results.reverse())
  }

  async findByIds(req: Request, res: Response) {
    console.log('findAll')

    console.log(req)
    if (!req.query.ids) {
      return res.status(400).send('invalid filters')
    }
    console.log(req.query.ids)
    const stringIds: string = req.query.ids as string
    const ids: number[] = stringIds.split(',').map((value) => parseInt(value))
    let results
    try {
      results = await UserRepository.retrieveByIds(ids)
    } catch (err) {
      return res.status(400).send('invalid filters')
    }
    const sortedResults: User[] = []
    for (let i = 0; i < ids.length; i++) {
      const result = results.find((value) => value.id === ids[i])
      if (result) {
        sortedResults.push(result)
      }
    }
    return res.status(200).send(sortedResults.reverse())
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
      const email = req.query.email as string

      const result = await UserRepository.retrieveByMail(email)
      return res.status(200).send({ userExists: result !== null })
    } catch (err) {
      console.log(err)
      return res.status(400).send('invalid email')
    }
  }

  async sendSMS(req: Request, res: Response) {
    const phoneNumber = req.body.phoneNumber as string
    const phoneCode = req.body.phoneCode as string
    try {
      const body = {
        To: phoneCode + phoneNumber,
        Channel: 'sms'
      }

      const response = await axios.post(
        `${process.env.TWILIO_URL}/${process.env.TWILIO_VERIFY_SID}/Verifications`,
        qs.stringify(body),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${process.env.TWILIO_SID}:${process.env.TWILIO_AUTH_TOKEN}`)}`
          }
        }
      )

      const json = await response.data
      console.log(json)
      res.status(200).send({ status: json.status === 'pending' })
      // return json.status === 'pending'
    } catch (error) {
      console.log(error)
      res.status(400).send('error')
    }
  }

  async checkVerification(req: Request, res: Response) {
    try {
      const phoneNumber = req.body.phoneNumber as string
      const phoneCode = req.body.phoneCode as string
      const code = req.body.code as string
      const data = qs.stringify({
        To: phoneCode + phoneNumber,
        Code: code
      })

      const response = await axios.post(
        `${process.env.TWILIO_URL}/${process.env.TWILIO_VERIFY_SID}/VerificationCheck`,
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${process.env.TWILIO_SID}:${process.env.TWILIO_AUTH_TOKEN}`)}`
          }
        }
      )
      const json = await response.data
      res.status(200).send({ valid: json.valid })
    } catch (error) {
      console.log(error)
      res.status(400).send('error')
    }
  }

  async findByPhone(req: Request, res: Response) {
    try {
      const phone = req.query.phone as string

      const result = await UserRepository.retrieveByPhone(phone)
      return res.status(200).send({ userExists: result !== null })
    } catch (err) {
      return res.status(400).send('invalid phone')
    }
  }
}
