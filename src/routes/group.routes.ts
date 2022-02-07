import GroupController from "../controllers/group.controller"
import { Router } from "express"
import * as core from 'express-serve-static-core'

export default (): core.Router => {
    const router: core.Router = Router()
    const Controller = new GroupController()

    // router.post("/auth/login", Controller.handleLogin)
    // router.get("/auth/me", [AuthMiddleware], Controller.handleMe)

    return router
}