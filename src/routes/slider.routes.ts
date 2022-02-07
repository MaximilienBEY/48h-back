import SliderController from "../controllers/slider.controller"
import { Router } from "express"
import * as core from 'express-serve-static-core'

export default (): core.Router => {
    const router: core.Router = Router()
    const Controller = new SliderController()

    router.post("/sliders", Controller.createSlider)
    router.get("/sliders/:id", Controller.editSlider)
    router.put("/sliders/:id", Controller.editSlider)
    router.delete("/sliders/:id", Controller.deleteSlider)

    return router
}