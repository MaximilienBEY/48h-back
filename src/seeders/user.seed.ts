import { hashSync } from "bcrypt"
import User from "../models/user.model"

export default async () => {
    await User.create({
        username: "admin",
        email: "admin@admin.fr",
        password: hashSync("admin", 10),
    })
}