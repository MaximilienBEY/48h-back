import AuthController from "../controllers/auth.controller"
import { Router } from "express"
import * as core from 'express-serve-static-core'

const authController = (): core.Router => {
    const router: core.Router = Router()
    const Controller = new AuthController()

    router.post("/auth/login", Controller.handleLogin)
    router.get("/auth/me", Controller.handleMe)

    return router
}

export default authController