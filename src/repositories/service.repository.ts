import Service from '../models/service.model'
import { Op } from 'sequelize'

interface IServiceRepository {
  save(service: Service): Promise<Service>

  retrieveById(serviceId: number): Promise<Service | null>

  retrieveAll(searchParams: { nameService: string }): Promise<Service[]>

  retrieveAllByOfficeId(officeId: number): Promise<Service[]>

  update(service: Service): Promise<number>

  delete(serviceId: number): Promise<number>

  deleteAll(): Promise<number>

  archive(serviceId: number): Promise<number>
}

class ServiceRepository implements IServiceRepository {
  async save(service: Service): Promise<Service> {
    console.log('Service create', service)
    return await Service.create(service)
  }

  async retrieveById(serviceId: number): Promise<Service | null> {
    return await Service.findByPk(serviceId)
  }

  async retrieveAll(searchParams: { nameService: string }): Promise<Service[]> {
    const { nameService } = searchParams
    return await Service.findAll({
      attributes: ['id', 'name', 'description', 'price', 'duration', 'ownerId'],
      where: {
        name: {
          [Op.like]: `%${nameService}%`
        },
        archive: false
      }
    })
  }

  async retrieveAllByOfficeId(officeId: number): Promise<Service[]> {
    return await Service.findAll({
      attributes: ['id', 'name', 'description', 'price', 'duration', 'officeId'],
      where: {
        officeId: officeId,
        archive: false
      }
    })
  }

  async update(service: Service): Promise<number> {
    try {
      const result = await Service.update(service, {
        where: {
          id: service.id
        }
      })
      return result[0]
    } catch (error) {
      throw new Error('Error while updating service')
    }
  }

  async archive(serviceId: number): Promise<number> {
    try {
      const result = await Service.update(
        { archive: true },
        {
          where: {
            id: serviceId
          }
        }
      )
      return result[0]
    } catch (error) {
      console.log(error)
      throw new Error('Error while archiving service')
    }
  }

  async delete(serviceId: number): Promise<number> {
    return await Service.destroy({
      where: {
        id: serviceId
      }
    })
  }

  async deleteAll(): Promise<number> {
    return await Service.destroy({
      where: {},
      truncate: false
    })
  }
}

export default new ServiceRepository()
