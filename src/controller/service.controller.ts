import ServiceRepository from '../repositories/service.repository'
import { Request, Response } from 'express'

export default class ServiceController {
  async create(req: Request, res: Response) {
    const payload = req.body
    console.log(payload)
    try {
      const result = await ServiceRepository.save(payload)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }

  async update(req: Request, res: Response) {
    const payload = req.body
    try {
      const result = await ServiceRepository.update(payload)
      return res.status(200).send(result.toString())
    } catch (err) {
      console.log('Update error')
      console.log(err)
      return res.status(400).send('something went wrong')
    }
  }

  async delete(req: Request, res: Response) {
    const payload = req.body.serviceId
    try {
      const result = await ServiceRepository.delete(payload)
      return res.status(200).send(result.toString())
    } catch (err) {
      console.log(err)
      return res.status(400).send('something went wrong')
    }
  }

  async retrieveAll(req: Request, res: Response) {
    const payload = req.body
    try {
      const result = await ServiceRepository.retrieveAll(payload)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }

  async retrieveById(req: Request, res: Response) {
    const payload = req.body
    try {
      const result = await ServiceRepository.retrieveById(payload)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }

  async retrieveAllByOfficeId(req: Request, res: Response) {
    const payload = req.body.officeId
    console.log(payload)
    try {
      const result = await ServiceRepository.retrieveAllByOfficeId(payload)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }
}
