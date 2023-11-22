import User from '../models/user.model'
import { Op } from 'sequelize'

interface IUserRepository {
  save(tutorial: User): Promise<User>

  retrieveById(UserId: number): Promise<User | null>

  retrieveAll(searchParams: { fullName: string }): Promise<User[]>

  retrieveByMail(UserMail: string): Promise<User | null>

  retrieveByPhone(UserPhone: string): Promise<User | null>

  retrieveByUsername(UserUsername: string): Promise<User | null>

  update(User: User): Promise<number>

  delete(UserId: number): Promise<number>

  deleteAll(): Promise<number>
}

class UserRepository implements IUserRepository {
  async save(User1: User): Promise<User> {
    return await User.create(User1)
  }

  async retrieveById(UserId: number): Promise<User | null> {
    return await User.findByPk(UserId)
  }

  async update(User1: User): Promise<number> {
    try {
      const result = await User.update(User1, {
        where: {
          id: User1.id
        }
      })
      return result[0]
    } catch (error) {
      throw new Error('Error while updating User')
    }
  }

  async retrieveAll(searchParams: { fullName: string }): Promise<User[]> {
    const { fullName } = searchParams
    const [searchByFirstName, searchByLastName] = fullName.split(' ')
    return await User.findAll({
      where: {
        first_name: {
          [Op.like]: searchByFirstName
        },
        last_name: {
          [Op.like]: searchByLastName
        }
      }
    })
  }

  async delete(UserId: number): Promise<number> {
    return await User.destroy({
      where: {
        id: UserId
      }
    })
  }

  async deleteAll(): Promise<number> {
    return await User.destroy({
      where: {},
      truncate: false
    })
  }

  async retrieveByMail(UserMail: string): Promise<User | null> {
    return await User.findOne({
      where: {
        email: UserMail
      }
    })
  }

  async retrieveByPhone(UserPhone: string): Promise<User | null> {
    return await User.findOne({
      where: {
        phone: UserPhone
      }
    })
  }
}

export default new UserRepository()
