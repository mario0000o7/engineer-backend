import { Op } from 'sequelize'
import Appointment from '../models/appointment.model'

interface IAppointmentRepository {
  save(appointment: Appointment): Promise<Appointment>

  retrieveById(appointmentId: number): Promise<Appointment | null>

  retrieveAll(searchParams: { date: Date }): Promise<Appointment[]>

  update(appointment: Appointment): Promise<number>

  delete(appointmentId: number): Promise<number>

  deleteAll(): Promise<number>
}

class AppointmentRepository implements IAppointmentRepository {
  async save(appointment: Appointment): Promise<Appointment> {
    return await Appointment.create(appointment)
  }

  async retrieveById(appointmentId: number): Promise<Appointment | null> {
    return await Appointment.findByPk(appointmentId)
  }

  async retrieveAll(searchParams: { date: Date }): Promise<Appointment[]> {
    const { date } = searchParams
    return await Appointment.findAll({
      where: {
        date: {
          [Op.eq]: date
        }
      }
    })
  }

  async update(appointment: Appointment): Promise<number> {
    try {
      const result = await Appointment.update(appointment, {
        where: {
          id: appointment.id
        }
      })
      return result[0]
    } catch (error) {
      throw new Error('Error while updating appointment')
    }
  }

  async delete(appointmentId: number): Promise<number> {
    return await Appointment.destroy({
      where: {
        id: appointmentId
      }
    })
  }

  async deleteAll(): Promise<number> {
    return await Appointment.destroy({
      where: {},
      truncate: false
    })
  }
}

export default new AppointmentRepository()
