import AppointmentRepository from '../repositories/appointment.repository'
import { Request, Response } from 'express'

export default class AppointmentController {
  async create(req: Request, res: Response) {
    const payload = req.body
    try {
      const result = await AppointmentRepository.save(payload)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }

  async update(req: Request, res: Response) {
    const payload = req.body
    try {
      const result = await AppointmentRepository.update(payload)
      return res.status(200).send(result.toString())
    } catch (err) {
      console.log('Update error')
      console.log(err)
      return res.status(400).send('something went wrong')
    }
  }

  async delete(req: Request, res: Response) {
    const payload = req.body.appointmentId
    try {
      const result = await AppointmentRepository.delete(payload)
      return res.status(200).send(result.toString())
    } catch (err) {
      console.log(err)
      return res.status(400).send('something went wrong')
    }
  }

  async retrieveAll(req: Request, res: Response) {
    const payload = req.body
    try {
      const result = await AppointmentRepository.retrieveAll(payload)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }

  async retrieveById(req: Request, res: Response) {
    const payload = req.body
    try {
      const result = await AppointmentRepository.retrieveById(payload)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }

  async readAvailableDatesForService(req: Request, res: Response) {
    const payload = req.body
    try {
      const result = await AppointmentRepository.readAvailableDatesForService(payload)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }

  async getAppointmentsForUser(req: Request, res: Response) {
    const payload = req.body.userId
    try {
      const result = await AppointmentRepository.getAllAppointmentsForUser(payload)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }

  async getAppointmentsForDoctor(req: Request, res: Response) {
    const payload = req.body.userId
    try {
      const result = await AppointmentRepository.getAllAppointmentsForDoctor(payload)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }
}
