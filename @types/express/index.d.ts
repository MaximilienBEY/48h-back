import User from "../../src/models/user.model";

export {}

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}