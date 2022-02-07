import AdminController from "../controllers/admin.controller"
import { Router } from "express"
import * as core from 'express-serve-static-core'
import { AuthMiddleware } from "../middlewares/auth.middleware"

const adminRoutes = (): core.Router => {
    const router: core.Router = Router()
    const Controller = new AdminController()


    return router
}

export default adminRoutes