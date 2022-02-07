import { Request, Response } from "express"
import User from "../models/user.model"

export const generateToken = (size: number): string => {
    if(size <= 0) return ""
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".repeat(64).split("").sort(() => Math.random() - .5).join("").slice(0, size - 1)
}

export const sliderVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if(!req.body.label) errors.push("Le label est obligatoire.")
    if(!req.body.title) errors.push("Le titre est obligatoire.")
    if (!Object.keys(req.files ?? {}).includes("media")) errors.push("Le media est obligatoire.")

    return errors
}
export const loginVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if(!req.body.email) errors.push("L'email est obligatoire.")
    if(!req.body.password) errors.push("Le mot de passe est obligatoire.")

    return errors
}