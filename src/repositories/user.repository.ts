import User from '../models/user.model'
import { Op } from 'sequelize'

interface IUserRepository {
  save(tutorial: User): Promise<User>

  retrieveById(UserId: number): Promise<User | null>

  retrieveAll(searchParams: { fullName: string }): Promise<User[]>

  retrieveByMail(UserMail: string): Promise<User | null>

  retrieveByPhone(UserPhone: string): Promise<User | null>

  update(User: User): Promise<number>

  delete(UserId: number): Promise<number>

  deleteAll(): Promise<number>
}

class UserRepository implements IUserRepository {
  async save(User1: User): Promise<User> {
    User1.phone = User1.phone.replace(/\s/g, '')
    User1.email = User1.email.toLowerCase()
    User1.email = User1.email.replace(/\s/g, '')
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
        firstName: {
          [Op.like]: searchByFirstName
        },
        lastName: {
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
    UserMail = UserMail.toLowerCase()
    UserMail = UserMail.replace(/\s/g, '')
    console.log(UserMail)
    return await User.findOne({
      where: {
        email: UserMail
      }
    })
  }

  async retrieveByPhone(UserPhone: string): Promise<User | null> {
    UserPhone = UserPhone.replace(/\s/g, '')
    return await User.findOne({
      where: {
        phone: UserPhone
      }
    })
  }
}

export default new UserRepository()
