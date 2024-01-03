import { DayOff } from '../models/dayOff.model'
import Office from '../models/office.model'

interface IDayOffRepository {
  save(dayOff: DayOff): Promise<DayOff>

  retrieveById(dayOffId: number): Promise<DayOff | null>

  retrieveAllByOfficeId(officeId: number): Promise<DayOff[]>

  update(dayOff: DayOff): Promise<number>

  delete(dayOffId: number): Promise<number>

  deleteAll(): Promise<number>
}

class DayOffRepository implements IDayOffRepository {
  async save(dayOff: DayOff): Promise<DayOff> {
    return await DayOff.create(dayOff)
  }

  async retrieveById(dayOffId: number): Promise<DayOff | null> {
    return await DayOff.findByPk(dayOffId)
  }

  async delete(dayOffId: number): Promise<number> {
    return await DayOff.destroy({
      where: {
        id: dayOffId
      }
    })
  }

  async deleteAll(): Promise<number> {
    return await DayOff.destroy({
      where: {},
      truncate: false
    })
  }

  async retrieveAllByOfficeId(officeId: number): Promise<DayOff[]> {
    return DayOff.findAll({
      where: {
        officeId: officeId
      },
      include: { model: Office, required: true, as: 'offices', attributes: ['name'] }
    })
  }

  async update(dayOff: DayOff): Promise<number> {
    const res = await DayOff.update(dayOff, {
      where: {
        id: dayOff.id
      }
    })
    return res[0]
  }

  async retrieveByUserId(userId: number): Promise<DayOff[]> {
    return DayOff.findAll({
      include: { model: Office, as: 'offices', required: true, attributes: ['name'], where: { ownerId: userId } }
    })
  }
}

export default new DayOffRepository()
