import SliderController from "../controllers/slider.controller"
import { Router } from "express"
import * as core from 'express-serve-static-core'
import { AuthMiddleware } from "../middlewares/auth.middleware"
import getSocket from "../socket"

const sliderRoutes = (socket: ReturnType<typeof getSocket>): core.Router => {
    const router: core.Router = Router()
    const Controller = new SliderController(socket)

    router.get("/sliders", Controller.getSliders)
    router.post("/sliders", [AuthMiddleware], Controller.createSlider)
    router.get("/sliders/:id", Controller.getSlider)
    router.put("/sliders/:id", [AuthMiddleware], Controller.editSlider)
    router.delete("/sliders/:id", [AuthMiddleware], Controller.deleteSlider)

    return router
}

export default sliderRoutes