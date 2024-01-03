import DayOffRepository from '../repositories/dayOff.repository'
import { Request, Response } from 'express'

export default class DayOffController {
  async create(req: Request, res: Response) {
    const payload = req.body
    try {
      const result = await DayOffRepository.save(payload)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }

  async update(req: Request, res: Response) {
    const payload = req.body
    try {
      const result = await DayOffRepository.update(payload)
      return res.status(200).send(result.toString())
    } catch (err) {
      console.log('Update error')
      console.log(err)
      return res.status(400).send('something went wrong')
    }
  }

  async delete(req: Request, res: Response) {
    const payload = req.body.dayOffId
    try {
      const result = await DayOffRepository.delete(payload)
      return res.status(200).send(result.toString())
    } catch (err) {
      console.log(err)
      return res.status(400).send('something went wrong')
    }
  }

  async retrieveAllByOfficeId(req: Request, res: Response) {
    const payload = req.body
    try {
      const result = await DayOffRepository.retrieveAllByOfficeId(payload.officeId)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }

  async retrieveById(req: Request, res: Response) {
    const payload = req.body
    try {
      const result = await DayOffRepository.retrieveById(payload.dayOffId)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }

  async retrieveByUserId(req: Request, res: Response) {
    const payload = req.body
    try {
      const result = await DayOffRepository.retrieveByUserId(payload.userId)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }
}
