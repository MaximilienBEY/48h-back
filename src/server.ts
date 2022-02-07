import * as express from "express"
import * as cookieParser from "cookie-parser"
import * as core from "express-serve-static-core"
import * as cors from "cors"
import * as http from "http"
import database from "./models"

type AppOption = {
    port?: number
    logging?: boolean
}

export default class Server {

    public app: express.Application
    private routers: core.Router[]
    private server?: http.Server
    private port: number
    private logging: boolean = true

    constructor(routers: core.Router[], option?: AppOption) {
        this.port = option?.port || 8000
        this.logging = option?.logging !== undefined ? option?.logging : this.logging
        this.routers = routers
        this.app = express()
    }

    private async initializeDatabase() {
        await database.sync({ force: true, logging: this.logging })
        this.logging && console.log("Database connected!")
    }

    private initializeMiddlewares() {
        this.app.use(cookieParser())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.json())
        this.app.use(cors({
            origin: "*"
        }))
    }

    private initializeRouter() {
        this.routers.map(router => this.app.use(router))
    }

    public async listen() {
        this.server = this.app.listen(this.port, () => this.logging && console.log(`Server listening on port ${this.port}!`))

        await this.initializeDatabase()
        this.initializeMiddlewares()
        this.initializeRouter()
    }

    public async close() {
        this.server?.close()
        await database.close()
    }


}