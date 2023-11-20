import * as process from 'process'

export const config = {
  HOST: process.env.PGHOST,
  USER: process.env.PGUSER,
  PASSWORD: process.env.PGPASSWORD,
  DB: process.env.PGDATABASE,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
}

export const dialect = 'postgres'
