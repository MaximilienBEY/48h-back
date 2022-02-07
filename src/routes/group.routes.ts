import GroupController from "../controllers/group.controller"
import { Router } from "express"
import * as core from 'express-serve-static-core'

export default (): core.Router => {
    const router: core.Router = Router()
    const Controller = new GroupController()

    router.get("/group/getGroups", Controller.getGroups)
    router.get("/group/getGroup/:id", Controller.getGroup)

    return router
}