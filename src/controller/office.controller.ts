import OfficeRepository from '../repositories/office.repository'
import { Request, Response } from 'express'

export default class OfficeController {
  async create(req: Request, res: Response) {
    const payload = req.body
    try {
      const result = await OfficeRepository.save(payload)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }

  async update(req: Request, res: Response) {
    const payload = req.body
    try {
      const result = await OfficeRepository.update(payload)
      return res.status(200).send(result.toString())
    } catch (err) {
      console.log('Update error')
      console.log(err)
      return res.status(400).send('something went wrong')
    }
  }

  async delete(req: Request, res: Response) {
    const payload = req.body.officeId
    console.log(payload)
    try {
      const result = await OfficeRepository.delete(payload)
      return res.status(200).send(result.toString())
    } catch (err) {
      console.log(err)
      return res.status(400).send('something went wrong')
    }
  }

  async retrieveAll(req: Request, res: Response) {
    const payload = req.body
    try {
      const result = await OfficeRepository.retrieveAll(payload)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }

  async retrieveById(req: Request, res: Response) {
    const payload = req.body
    try {
      const result = await OfficeRepository.retrieveById(payload)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }

  async retrieveByOwnerId(req: Request, res: Response) {
    const payload = req.body
    const { ownerId } = payload
    try {
      const result = await OfficeRepository.retrieveAllByOwnerId(ownerId)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }
}