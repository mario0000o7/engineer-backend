import { Op } from 'sequelize'
import Appointment from '../models/appointment.model'
import Service from '../models/service.model'
import Office from '../models/office.model'
import { DayOff } from '../models/dayOff.model'

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
    const service = await Service.findByPk(appointment.serviceId)
    if (!service) throw new Error('Service not found')
    appointment.price = service.price
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

  async getAllAppointmentsForUser(userId: number): Promise<Appointment[]> {
    return await Appointment.findAll({
      attributes: ['id', 'userId', 'serviceId', 'date', 'price', 'archive'],
      where: { userId: userId },
      include: [
        {
          model: Service,
          as: 'services',
          attributes: ['duration', 'name', 'description', 'price', 'archive', 'officeId', 'id'],
          include: [
            {
              model: Office,
              as: 'offices',
              attributes: ['name']
            }
          ]
        }
      ]
    })
  }

  async getAllAppointmentsForDoctor(userId: number): Promise<Appointment[]> {
    console.log(userId)
    return await Appointment.findAll({
      attributes: ['id', 'userId', 'serviceId', 'date', 'price', 'archive'],
      include: [
        {
          model: Service,
          as: 'services',
          attributes: ['duration', 'name', 'description', 'price', 'archive', 'officeId', 'id'],
          include: [
            {
              model: Office,
              as: 'offices',
              attributes: ['name'],
              where: { ownerId: userId }
            }
          ]
        }
      ]
    })
  }

  async moveAppointment(appointmentId: number, date: Date): Promise<number> {
    console.log(appointmentId)
    console.log(date)
    try {
      const result = await Appointment.update(
        { date: date },
        {
          where: {
            id: appointmentId
          }
        }
      )
      return result[0]
    } catch (error) {
      console.log(error)
      throw new Error('Error while moving appointment')
    }
  }

  async readAvailableDatesForService(searchParams: { serviceId: number }): Promise<Date[]> {
    const { serviceId } = searchParams
    const service = await this.getServiceWithOffice(serviceId)
    const office = service?.offices
    const dayOffs = this.getDayOffsForOffice(office!.id)
    let dates: Date[] = []

    if (service && office) {
      dates = this.generateDatesForOffice(office)
      const deleteCount = this.getServiceDurationInQuarters(service)
      const appointments = await this.getAppointmentsForOffice(office.id)

      dates = this.removeBookedDates(dates, appointments)
      dates = this.removeInsufficientDurationDates(dates, deleteCount)
      dates = this.removeEdgeDates(dates, office.timeTo)
      await dayOffs.then((dayOffs) => {
        for (const dayOff of dayOffs) {
          const startDayOff = new Date(dayOff.dateFrom)
          startDayOff.setHours(0)
          startDayOff.setMinutes(0)
          startDayOff.setSeconds(0)
          startDayOff.setMilliseconds(0)
          const endDayOff = new Date(dayOff.dateTo)
          endDayOff.setHours(23)
          endDayOff.setMinutes(59)
          endDayOff.setSeconds(59)
          endDayOff.setMilliseconds(999)
          dates = dates.filter((date) => date.getTime() < startDayOff.getTime() || date.getTime() > endDayOff.getTime())
        }
      })
    }

    return dates
  }

  private async getDayOffsForOffice(officeId: number) {
    return await DayOff.findAll({
      attributes: ['id', 'officeId', 'dateFrom', 'dateTo'],
      where: { officeId: officeId },
      include: [{ model: Office, as: 'offices', attributes: ['id', 'name'], where: { id: officeId } }]
    })
  }

  private async getServiceWithOffice(serviceId: number) {
    console.log('serviceId', serviceId)
    return await Service.findOne({
      attributes: ['id', 'name', 'description', 'price', 'duration', 'officeId'],
      where: { id: serviceId, archive: false },
      include: [{ model: Office, as: 'offices', attributes: ['id', 'timeFrom', 'timeTo'], where: { archive: false } }]
    })
  }

  private generateDatesForOffice(office: Office): Date[] {
    const dates: Date[] = []
    for (let i = 0; i < 14; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      let dayOfWeek = date.getDay() - 1
      if (dayOfWeek === -1) dayOfWeek = 6

      const startHour = office.timeFrom[dayOfWeek].getHours() * 60 + office.timeFrom[dayOfWeek].getMinutes()
      const endHour = office.timeTo[dayOfWeek].getHours() * 60 + office.timeTo[dayOfWeek].getMinutes()

      for (let j = startHour; j <= endHour; j += 15) {
        const newDate = new Date(date)
        newDate.setHours(Math.floor(j / 60))
        newDate.setMinutes(j % 60)
        newDate.setSeconds(0)
        newDate.setMilliseconds(0)
        dates.push(newDate)
      }
    }
    return dates
  }

  private getServiceDurationInQuarters(service: Service): number {
    return (service.duration.getHours() * 60 + service.duration.getMinutes()) / 15
  }

  private async getAppointmentsForOffice(officeId: number) {
    return await Appointment.findAll({
      attributes: ['id', 'userId', 'serviceId', 'date', 'price', 'archive'],
      include: [
        {
          model: Service,
          as: 'services',
          attributes: ['duration'],
          where: { officeId: officeId },
          include: [{ model: Office, as: 'offices', attributes: [], where: { id: officeId } }]
        }
      ]
    })
  }

  private removeBookedDates(dates: Date[], appointments: Appointment[]): Date[] {
    console.log('appointments', appointments)
    for (const appointment of appointments) {
      for (const date of dates) {
        if (appointment.date.getTime() === date.getTime()) {
          const serviceDuration = this.getServiceDurationInQuarters(appointment.services!)
          dates.splice(dates.indexOf(date), serviceDuration)
          break
        }
      }
    }
    return dates
  }

  private removeInsufficientDurationDates(dates: Date[], deleteCount: number): Date[] {
    const tmpDates = [...dates]
    for (const date of dates) {
      for (let i = 1; i < deleteCount; i++) {
        const find = dates.find((d) => d.getTime() == date.getTime() + 15 * i * 60 * 1000)
        if (!find) {
          tmpDates.splice(tmpDates.indexOf(date), 1)
          break
        }
      }
    }
    return tmpDates
  }

  private removeEdgeDates(dates: Date[], timeTo: Date[]): Date[] {
    const tmpDates = [...dates]
    for (const date of dates) {
      if (date.getTime() < new Date().getTime()) {
        tmpDates.splice(tmpDates.indexOf(date), 1)
        continue
      }
      let numberOfWeek = date.getDay() - 1
      if (numberOfWeek === -1) numberOfWeek = 6
      if (
        date.getHours() * 60 + date.getMinutes() >=
        timeTo[numberOfWeek].getHours() * 60 + timeTo[numberOfWeek].getMinutes()
      ) {
        tmpDates.splice(tmpDates.indexOf(date), 1)
      }
    }
    return tmpDates
  }
}

export default new AppointmentRepository()
