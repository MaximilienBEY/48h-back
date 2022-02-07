import AdminController from "../controllers/admin.controller"
import { Router } from "express"
import * as core from 'express-serve-static-core'

const adminRoutes = (): core.Router => {
    const router: core.Router = Router()
    const Controller = new AdminController()

    router.post("/admin/login", Controller.handleLogin)
    router.get("/admin/me", Controller.handleMe)

    return router
}

export default adminRoutes