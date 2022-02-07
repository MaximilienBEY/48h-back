import Server from "./server"
import authRoutes from "./routes/group.routes"
import adminRoutes from "./routes/auth.routes"

const server = new Server([
    authRoutes(),
    adminRoutes()
], {
    logging: true,
    force: true
})

server.listen()