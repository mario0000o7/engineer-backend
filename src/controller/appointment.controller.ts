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

  async moveAppointment(req: Request, res: Response) {
    const payload = req.body
    const { appointmentId, date } = payload
    try {
      const result = await AppointmentRepository.moveAppointment(appointmentId, date)
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
    const payload = req.query.appointmentId as string
    try {
      const result = await AppointmentRepository.retrieveById(parseInt(payload))
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }

  async readAvailableDatesForService(req: Request, res: Response) {
    const payload = req.query.serviceId as string
    try {
      const result = await AppointmentRepository.readAvailableDatesForService({ serviceId: parseInt(payload) })
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }

  async getAppointmentsForUser(req: Request, res: Response) {
    const payload = req.query.userId as string
    try {
      const result = await AppointmentRepository.getAllAppointmentsForUser(parseInt(payload))
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }

  async getAppointmentsForDoctor(req: Request, res: Response) {
    const payload = req.query.doctorId as string
    try {
      const result = await AppointmentRepository.getAllAppointmentsForDoctor(parseInt(payload))
      console.log('result', result)
      return res.status(200).send(result)
    } catch (err) {
      console.log(err)
      return res.status(500).send('something went wrong')
    }
  }
}
