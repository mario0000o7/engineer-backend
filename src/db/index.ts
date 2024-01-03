import { Sequelize } from 'sequelize-typescript'
import { config, dialect } from '../config/db.config'
import { User } from '../models/user.model'
import Office from '../models/office.model'
import Service from '../models/service.model'
import Appointment from '../models/appointment.model'
import { DayOff } from '../models/dayOff.model'

class Database {
  public sequelize: Sequelize | undefined

  constructor() {
    console.log('Database constructor')
    console.log('PGHOST', process.env.PGHOST)
    console.log('PGUSER', process.env.PGUSER)
    console.log('PGPASSWORD', process.env.PGPASSWORD)
    console.log('PGDATABASE', process.env.PGDATABASE)
    this.connectToDatabase()
      .then()
      .catch((err) => {
        console.log(err)
      })
  }

  private async connectToDatabase() {
    this.sequelize = new Sequelize({
      database: config.DB,
      username: config.USER,
      password: config.PASSWORD,
      host: config.HOST,
      dialect: dialect,
      pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
      },
      timezone: '+01:00',
      dialectOptions: config.dialectOptions,

      models: [User, Office, Service, Appointment, DayOff]
    })
    Service.associate()
    Appointment.associate()

    await this.sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.')
      })
      .catch((err) => {
        console.error('Unable to connect to the Database:', err)
      })
  }
}

export default Database
