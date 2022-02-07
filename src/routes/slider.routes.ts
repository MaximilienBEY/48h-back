import SliderController from "../controllers/slider.controller"
import { Router } from "express"
import * as core from 'express-serve-static-core'
import { AuthMiddleware } from "../middlewares/auth.middleware"

export default (): core.Router => {
    const router: core.Router = Router()
    const Controller = new SliderController()

    router.post("/sliders", [AuthMiddleware], Controller.createSlider)
    router.get("/sliders/:id", Controller.editSlider)
    router.put("/sliders/:id", [AuthMiddleware], Controller.editSlider)
    router.delete("/sliders/:id", [AuthMiddleware], Controller.deleteSlider)

    return router
}