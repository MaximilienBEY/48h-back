import SliderController from "../controllers/slider.controller"
import { Router } from "express"
import * as core from 'express-serve-static-core'

export default (): core.Router => {
    const router: core.Router = Router()
    const Controller = new SliderController()

    router.post("/sliders", Controller.createSlider)

    // router.post("/auth/login", Controller.handleLogin)
    // router.get("/auth/me", [AuthMiddleware], Controller.handleMe)

    return router
}