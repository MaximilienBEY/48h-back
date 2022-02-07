import { Request, Response } from "express"
import { hashSync, compareSync } from "bcrypt"
import * as jwt from "jsonwebtoken"
import { Token, UserCreationAttribute } from "../interfaces/auth.interface"
import User from "../models/user.model"
import { generateToken, loginVerification, registerVerification } from "../utils/verifications"
import Access from "../models/access.model"
import { getUser, REFRESH_EXPIRATION, SIGNATURE } from "../utils/auth.utils"
import { getToken } from "../utils/basic"

export default class AdminController {

    
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