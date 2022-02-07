import Server from "./server"
import authRoutes from "./routes/auth.routes"
import adminRoutes from "./routes/admin.routes"

const server = new Server([
    authRoutes(),
    adminRoutes()
], {
    logging: false
})
server.listen()
