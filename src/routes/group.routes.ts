import GroupController from "../controllers/group.controller"
import { Router } from "express"
import * as core from 'express-serve-static-core'
import { AuthMiddleware } from "../middlewares/auth.middleware"
import getSocket from "../socket"

const groupRoutes = (socket: ReturnType<typeof getSocket>): core.Router => {
    const router: core.Router = Router()
    const Controller = new GroupController(socket)

    router.get("/groups", Controller.getGroups)
    router.post("/groups", [AuthMiddleware], Controller.createGroup)
    router.get("/groups/:id", Controller.detailGroup)
    router.put("/groups/:id", [AuthMiddleware], Controller.editGroup)
    router.delete("/groups/:id", [AuthMiddleware], Controller.deleteGroup)

    return router
}

export default groupRoutes