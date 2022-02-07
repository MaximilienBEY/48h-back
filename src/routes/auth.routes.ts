import AuthController from "../controllers/auth.controller"
import { Router } from "express"
import * as core from 'express-serve-static-core'
import { AuthMiddleware } from "../middlewares/auth.middleware"

export default (): core.Router => {
    const router: core.Router = Router()
    const Controller = new AuthController()

    router.post("/auth/register", Controller.handleRegister)
    router.post("/auth/login", Controller.handleLogin)
    router.get("/auth/me", [AuthMiddleware], Controller.handleMe)

    return router
}