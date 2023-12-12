import Office from '../models/office.model'
import { Op } from 'sequelize'

interface IOfficeRepository {
  save(office: Office): Promise<Office>

  retrieveById(officeId: number): Promise<Office | null>

  retrieveAll(searchParams: { nameOffice: string }): Promise<Office[]>

  retrieveAllByOwnerId(ownerId: number): Promise<Office[]>

  update(office: Office): Promise<number>

  delete(officeId: number): Promise<number>

  deleteAll(): Promise<number>
}

class OfficeRepository implements IOfficeRepository {
  async delete(officeId: number): Promise<number> {
    return await Office.destroy({
      where: {
        id: officeId
      }
    })
  }

  retrieveAllByOwnerId(ownerId: number): Promise<Office[]> {
    return Office.findAll({
      where: {
        ownerId: ownerId
      }
    })
  }

  async deleteAll(): Promise<number> {
    return await Office.destroy({
      where: {},
      truncate: false
    })
  }

  async retrieveAll(searchParams: { nameOffice: string }): Promise<Office[]> {
    const { nameOffice } = searchParams
    return await Office.findAll({
      attributes: [
        'id',
        'name',
        'address1',
        'address2',
        'city',
        'country',
        'postalCode',
        'ownerId',
        'timeFrom',
        'timeTo'
      ],
      where: {
        name: {
          [Op.like]: `%${nameOffice}%`
        }
      }
    })
  }

  async retrieveById(officeId: number): Promise<Office | null> {
    return await Office.findByPk(officeId)
  }

  async save(office: Office): Promise<Office> {
    return await Office.create(office)
  }

  async update(office: Office): Promise<number> {
    try {
      const result = await Office.update(office, {
        where: {
          id: office.id
        }
      })
      return result[0]
    } catch (error) {
      throw new Error('Error while updating office')
    }
  }
}

export default new OfficeRepository()
