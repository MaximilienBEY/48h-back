import { Request, Response } from "express"
import User from "../models/user.model"

export const generateToken = (size: number): string => {
    if(size <= 0) return ""
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".repeat(64).split("").sort(() => Math.random() - .5).join("").slice(0, size - 1)
}

export const registerVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if(!req.body.username) errors.push("L'username est obligatoire.")
    else if (req.body.username.length < 2) errors.push("L'username doit contenir au minimum 2 caractères.")

    if(!req.body.email) errors.push("L'email est obligatoire.")
    else if(!/([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/g.test(req.body.email)) errors.push("L'email doit être au bon format.")
    else if (await User.findOne({where: {email: req.body.email}})) errors.push("L'email est déjà utilisé par un autre compte.")

    if(!req.body.password) errors.push("Le mot de passe est obligatoire.")
    else if (req.body.password.length < 6) errors.push("Le mot de passe doit contenir au minimum 6 caractères.")

    return errors
}
export const loginVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if(!req.body.email) errors.push("L'email est obligatoire.")
    if(!req.body.password) errors.push("Le mot de passe est obligatoire.")

    return errors
}