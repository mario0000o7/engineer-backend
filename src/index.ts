import express, { Application } from 'express'
import cors, { CorsOptions } from 'cors'
import Routes from './routes'
import Database from './db'
import dotenv from 'dotenv'

dotenv.config()

// function errorHandler(request: Request, response: Response) {
//   response.status(500).json({
//     message: 'Something went wrong'
//   })
// }

export default class Server {
  constructor(app: Application) {
    this.config(app)
    this.syncDatabase()
    // const appID: string = process.env.APP_ID_COSMO_CHAT!
    // const region: string = process.env.REGION_COSMO_CHAT!
    // const appSetting: CometChat.AppSettings = new CometChat.AppSettingsBuilder()
    //   .subscribePresenceForAllUsers()
    //   .setRegion(region)
    //   .autoEstablishSocketConnection(true)
    //   .build()
    // CometChat.init(appID, appSetting).then(
    //   (initialized: boolean) => {
    //     console.log('Initialization completed successfully', initialized)
    //   },
    //   (error: CometChat.CometChatException) => {
    //     console.log('Initialization failed with error:', error)
    //   }
    // )
    new Routes(app)
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: 'http://localhost:8081'
    }

    app.use(cors(corsOptions))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    // app.use(errorHandler)
  }

  private syncDatabase(): void {
    const db = new Database()
    db.sequelize?.sync()
  }
}
const app: Application = express()
new Server(app)
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080
app
  .listen(PORT, '0.0.0.0', function () {
    console.log(`Server is running on port ${PORT}.`)
  })
  .on('error', (err: Error) => {
    if (err.message === 'EADDRINUSE') {
      console.log('Error: address already in use')
    } else {
      console.log(err)
    }
  })
