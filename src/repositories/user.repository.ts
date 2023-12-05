import User from '../models/user.model'
import { Op } from 'sequelize'

interface IUserRepository {
  save(tutorial: User): Promise<User>

  retrieveById(UserId: number): Promise<User | null>

  retrieveAll(searchParams: { fullName: string }): Promise<User[]>

  retrieveByMail(UserMail: string): Promise<User | null>

  retrieveByPhone(UserPhone: string): Promise<User | null>

  retrieveAllByRole(role: number): Promise<User[]>

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

  async retrieveAllByRole(role: number): Promise<User[]> {
    return await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'role', 'avatarImg', 'birthDate'],
      where: {
        role: role
      }
    })
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

  async retrieveAll(searchParams: { fullName: string; role: number }): Promise<User[]> {
    const { fullName, role } = searchParams
    return await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'role', 'avatarImg', 'birthDate'],
      where: {
        [Op.or]: [
          {
            firstName: {
              [Op.like]: `%${fullName}%`
            }
          },
          {
            lastName: {
              [Op.like]: `%${fullName}%`
            }
          }
        ],
        role: role
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

  async retrieveByIds(ids: number[]): Promise<User[]> {
    return await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'role', 'avatarImg', 'birthDate'],
      where: {
        id: ids
      }
    })
  }
}

export default new UserRepository()
