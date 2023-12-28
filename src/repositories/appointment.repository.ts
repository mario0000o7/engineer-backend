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

  archive(appointmentId: number): Promise<number>

  deleteAll(): Promise<number>
}

class AppointmentRepository implements IAppointmentRepository {
  async save(appointment: Appointment): Promise<Appointment> {
    return await Appointment.create(appointment)
  }

  async archive(appointmentId: number): Promise<number> {
    try {
      const result = await Appointment.update(
        { archive: true },
        {
          where: {
            id: appointmentId
          }
        }
      )
      return result[0]
    } catch (error) {
      console.log(error)
      throw new Error('Error while archiving appointment')
    }
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
    for (let i = 0; i < 14; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      let dayOfWeek = date.getDay() - 1
      if (dayOfWeek === -1) {
        dayOfWeek = 6
      }

      const startHour = office.timeFrom[dayOfWeek].getHours() * 60 + office.timeFrom[dayOfWeek].getMinutes()
      const endHour = office.timeTo[dayOfWeek].getHours() * 60 + office.timeTo[dayOfWeek].getMinutes()
      console.log(startHour, endHour)

      for (let j = startHour; j <= endHour; j += 15) {
        const newDate = new Date(date)
        console.log('j', Math.floor(j / 60))
        newDate.setHours(Math.floor(j / 60))
        newDate.setMinutes(j % 60)
        newDate.setSeconds(0)
        newDate.setMilliseconds(0)
        console.log(
          'Plus',
          service?.duration.getHours() * 60 +
            service?.duration.getMinutes() +
            newDate.getHours() * 60 +
            newDate.getMinutes()
        )
        // if (
        //   newDate.getHours() * 60 +
        //     newDate.getMinutes() +
        //     service?.duration.getHours() * 60 +
        //     service?.duration.getMinutes() >
        //   endHour
        // ) {
        //   continue
        // }

        dates.push(newDate)
      }
    }
    console.log('Dates', dates)
    const deleteCount = (service.duration.getHours() * 60 + service.duration.getMinutes()) / 15

    const appointments = await Appointment.findAll({
      attributes: ['id', 'userId', 'serviceId', 'date', 'price', 'archive'],
      include: [
        {
          model: Service,
          as: 'services',
          attributes: [],
          include: [
            {
              model: Office,
              as: 'offices',
              attributes: [],
              where: {
                id: office.id
              }
            }
          ]
        }
      ]
    })
    console.log('Appointments', appointments)
    for (const appointment of appointments) {
      for (const date of dates) {
        if (appointment.date.getTime() === date.getTime()) {
          console.log('Date', date, 'Appointment', appointment.date, 'Delete count', deleteCount)
          dates.splice(dates.indexOf(date) + 1, deleteCount - 1)
          break
        }
      }
    }
    const tmpDates = [...dates]
    console.log('Dates', dates)
    for (const date of dates) {
      // if (date.getTime() < new Date().getTime()) {
      //   dates.splice(dates.indexOf(date), 1)
      //   continue
      // }
      console.log('Date', date)
      for (let i = 1; i <= deleteCount; i++) {
        const find = dates.find((d) => d.getTime() == date.getTime() + 15 * i * 60 * 1000)
        // const tmp = date.getHours() * 60 + date.getMinutes() + 15 * i
        // console.log('Date current', (tmp / 60).toFixed(0) + ':' + (tmp % 60).toFixed(0))
        console.log('Date find', find)
        if (!find) {
          console.log('Date delete', date)
          const l = tmpDates.splice(tmpDates.indexOf(date), 1)
          console.log('Date delete', l)
          break
        }
      }
    }
    console.log('Dates', tmpDates)
    return tmpDates
  }
}

export default new AppointmentRepository()
