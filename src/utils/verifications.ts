import { Request, Response } from "express"
import Slider from "../models/slider.model"
import User from "../models/user.model"

export const generateToken = (size: number): string => {
    if(size <= 0) return ""
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".repeat(64).split("").sort(() => Math.random() - .5).join("").slice(0, size - 1)
}

export const sliderVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if(!req.body.label) errors.push("Le label est obligatoire.")

    return errors
}
export const loginVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if(!req.body.email) errors.push("L'email est obligatoire.")
    if(!req.body.password) errors.push("Le mot de passe est obligatoire.")

    return errors
}
export const groupVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if(!req.body.label) errors.push("Le label est obligatoire.")
    
    if (!req.body.sliders) req.body.sliders = req.body["sliders[]"]
    if (!Array.isArray(req.body.sliders)) req.body.sliders = [req.body.sliders]
    if(!req.body.sliders || !Array.isArray(req.body.sliders)) errors.push("Les sliders sont obligatoires.")
    else {
        req.body.sliders = req.body.sliders.map((s: string) => parseInt(s)).filter((id: number, i: number, self: number[]) => self.indexOf(id) === i)
        if (req.body.sliders.find((f: number) => isNaN(f))) errors.push("Les sliders doivent être des ids.")
        let sliders = await Promise.all((req.body.sliders as number[]).map((id: number) => Slider.findByPk(id)))
        if (!sliders.filter(f => !!f).length) errors.push("Vous devez mettre un slider au minimum.")
    }
    return errors
}
export const editGroupVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if (!req.body.sliders) req.body.sliders = req.body["sliders[]"]
    if (!Array.isArray(req.body.sliders)) req.body.sliders = [req.body.sliders]
    if(!req.body.sliders || !Array.isArray(req.body.sliders)) errors.push("Les sliders sont obligatoires.")
    else {
        req.body.sliders = req.body.sliders.map((s: string) => parseInt(s)).filter((id: number, i: number, self: number[]) => self.indexOf(id) === i)
        if (req.body.sliders.find((f: number) => isNaN(f))) errors.push("Les sliders doivent être des ids.")
        let sliders = await Promise.all((req.body.sliders as number[]).map((id: number) => Slider.findByPk(id)))
        if (!sliders.filter(f => !!f).length) errors.push("Vous devez mettre un slider au minimum.")
    }

    return errors
}