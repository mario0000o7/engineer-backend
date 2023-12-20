import { Op } from 'sequelize'
import Appointment from '../models/appointment.model'
import Service from '../models/service.model'
import Office from '../models/office.model'

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

  async readAvailableDatesForService(searchParams: { serviceId: number }): Promise<Date[]> {
    const { serviceId } = searchParams

    const service = await Service.findByPk(serviceId)
    const office = await Office.findByPk(service?.officeId)
    const dates: Date[] = []
    if (!service || !office) {
      return dates
    }
    const timeStep = service.duration.getHours() * 60 + service.duration.getMinutes()
    for (let j = 0; j < 14; j++) {
      const today = new Date()
      today.setDate(today.getDate() + j)
      const dayWeek = today.getDay()
      if (dayWeek === 0 || dayWeek === 6) {
        continue
      }

      for (
        let i = office?.timeFrom.getHours() * 60 + office?.timeFrom.getMinutes();
        i < office?.timeTo.getHours() * 60 + office?.timeTo.getMinutes();
        i += 15
      ) {
        console.log('i', i)
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), Math.floor(i / 60) + 1, i % 60)
        const hoursPlusMinutes = date.getUTCHours() * 60 + date.getUTCMinutes()
        const serviceHoursPlusMinutes = service.duration.getHours() * 60 + service.duration.getMinutes()
        console.log('hoursPlusMinutes', hoursPlusMinutes)
        console.log('Hours', date.getHours())
        console.log('Minutes', date.getMinutes())
        console.log('serviceHoursPlusMinutes', serviceHoursPlusMinutes)
        console.log(
          'office?.timeTo.getHours() * 60 + office?.timeTo.getMinutes()',
          office?.timeTo.getHours() * 60 + office?.timeTo.getMinutes()
        )
        console.log('Date', date)
        if (hoursPlusMinutes + serviceHoursPlusMinutes > office?.timeTo.getHours() * 60 + office?.timeTo.getMinutes()) {
          break
        }
        dates.push(date)
      }
    }
    const appointments = await Appointment.findAll({
      where: {
        serviceId: serviceId
      }
    })
    appointments.forEach((appointment) => {
      const index = dates.findIndex((date) => date.getTime() === appointment.date.getTime() + 3600000)
      console.log('ADate', appointment.date)
      console.log('index', index)
      if (index !== -1) {
        const deleteCount = (service.duration.getHours() * 60 + service.duration.getMinutes()) / 15
        console.log('Service duration', service.duration.getHours() * 60 + service.duration.getMinutes())
        console.log('deleteCount', deleteCount)
        console.log('Date', dates[index])
        dates.splice(index, deleteCount)
      }
    })
    return dates
  }
}

export default new AppointmentRepository()
