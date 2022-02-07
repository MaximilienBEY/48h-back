import { Request, Response } from "express"
import { hashSync, compareSync } from "bcrypt"
import * as jwt from "jsonwebtoken"
import User from "../models/user.model"
import { generateToken, loginVerification, registerVerification } from "../utils/verifications"
import Access from "../models/slider.model"
import { getUser, REFRESH_EXPIRATION, SIGNATURE } from "../utils/auth.utils"

export default class AdminController {

    // public createUser = async (attribute: UserCreationAttribute): Promise<User|null> => {
    //     let password = hashSync(attribute.password, 10)

    //     let user = await User.create({
    //         username: attribute.username,
    //         email: attribute.email,
    //         password,
    //     })
    //     return user
    // }

    public handleLogin = async (req: Request, res: Response): Promise<any> => {
        console.log(req.body)
        let errors = await loginVerification(req)
        if (errors.length) return res.status(400).json({ type: "error", errors })

        let email: string = req.body.email
        let password: string = req.body.password

        let user = await User.findOne({ where: { email } })
        if (!user || !compareSync(password, user.password)) return res.status(400).json({ type: "error", errors: ["Email ou mot de passe invalide."] })

        return res.json({ type: "success", token: jwt.sign({userId: user.id}, SIGNATURE) })
    }
    public handleMe = async (req: Request, res: Response): Promise<any> => {
        let user = await getUser(req)
        if(!user) return res.status(401).json({type: "error", errors: ["Unauthorized"]})

        res.json({ type: "success", user: {
            id: user.id,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        } })
    }
}