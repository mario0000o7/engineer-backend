import { Sequelize } from 'sequelize-typescript'
import { config, dialect } from '../config/db.config'
import { User } from '../models/user.model'

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
      dialectOptions: config.dialectOptions,

      models: [User]
    })

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
