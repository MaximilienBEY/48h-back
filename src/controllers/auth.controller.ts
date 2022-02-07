import { Request, Response } from "express"
import { hashSync, compareSync } from "bcrypt"
import * as jwt from "jsonwebtoken"
import { Token, UserCreationAttribute } from "../interfaces/auth.interface"
import User from "../models/user.model"
import { generateToken, loginVerification, registerVerification } from "../utils/verifications"
import Access from "../models/access.model"
import { getUser, REFRESH_EXPIRATION, SIGNATURE } from "../utils/auth.utils"
import { getToken } from "../utils/basic"

export default class AuthController {

    public createUser = async (attribute: UserCreationAttribute): Promise<User|null> => {
        let password = hashSync(attribute.password, 10)

        let user = await User.create({
            username: attribute.username,
            email: attribute.email,
            password,
        })
        return user
    }

    public handleRegister = async (req: Request, res: Response): Promise<any> => {
        let errors = await registerVerification(req)
        if (errors.length) return res.status(400).json({ type: "error", errors })

        let user = await this.createUser(req.body)
        if (!user) return res.status(500).json({ type: "error", errors: ["Server error!"] })

        return res.json({ type: "success", message: "Votre compte a été créé" })
    }
    public handleLogin = async (req: Request, res: Response): Promise<any> => {
        let errors = await loginVerification(req)
        if (errors.length) return res.status(400).json({ type: "error", errors })

        let email: string = req.body.email
        let password: string = req.body.password

        let user = await User.findOne({ where: { email } })
        if (!user || !compareSync(password, user.password)) return res.status(400).json({ type: "error", errors: ["Email ou mot de passe invalide."] })

        let sessionToken = generateToken(50)
        let refreshToken = generateToken(50)
        await Access.create({
            refresh: refreshToken,
            session: sessionToken,
            expireAt: new Date(new Date().setDate(new Date().getDate() + REFRESH_EXPIRATION)),
            userId: user.id
        })

        return res.json({ type: "success", token: getToken(sessionToken, refreshToken) })
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
    public handleLogout = async (req: Request, res: Response): Promise<any> => {
        let bearer = req.headers.authorization as string

        await Access.destroy({where: {session: bearer.replace("Bearer ", "")}})
        res.json({
            type: "success",
            user: {
                
            }
        })

    }


}