import * as express from "express"
import * as cookieParser from "cookie-parser"
import * as core from "express-serve-static-core"
import * as cors from "cors"
import * as http from "http"
import * as fileUpload from "express-fileupload"
import database from "./models"
import Seed from "./seeders"
import getSocket from "./socket"

type AppOption = {
    port?: number
    logging?: boolean
    force?: boolean
}

export default class Server {

    public app: express.Application
    private routers: ((socket: ReturnType<typeof getSocket>) => core.Router)[]
    private server: http.Server
    private port: number
    private logging: boolean = true
    private force: boolean = false
    private socket: ReturnType<typeof getSocket>

    constructor(routers: ((socket: ReturnType<typeof getSocket>) => core.Router)[], option?: AppOption) {
        this.port = option?.port || 8000
        this.logging = option?.logging ?? this.logging
        this.force = option?.force ?? this.force
        this.routers = routers
        this.app = express()
        this.server = http.createServer(this.app)
        this.socket = getSocket(this.server)
    }

    private async initializeDatabase() {
        await database.sync({ force: this.force, logging: this.logging })
        this.logging && console.log("Database connected!")
    }

    private initializeMiddlewares() {
        this.app.use(cookieParser())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.json())
        this.app.use(cors({
            origin: "*"
        }))
        this.app.use(fileUpload())
    }

    private initializeRouter() {
        this.routers.map(router => this.app.use(router(this.socket)))
        this.app.use("/cdn", express.static("./cdn"))
    }

    public async listen() {
        this.server.listen(this.port, () => this.logging && console.log(`Server listening on port ${this.port}!`))

        await this.initializeDatabase()
        await this.seed()
        this.initializeMiddlewares()
        this.initializeRouter()
    }

    public async seed() {
        await Seed()
    }

    public async close() {
        this.server.close()
        await database.close()
    }


}