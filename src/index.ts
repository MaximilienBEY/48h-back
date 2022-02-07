import Server from "./server"
import groupRoutes from "./routes/group.routes"
import authRoutes from "./routes/auth.routes"
import sliderRoutes from "./routes/slider.routes"

const server = new Server([
    groupRoutes(),
    authRoutes(),
    sliderRoutes()
], {
    logging: false,
    // force: true
})

server.listen()