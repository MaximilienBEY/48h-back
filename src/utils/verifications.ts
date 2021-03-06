import { Request, Response } from "express"
import Slider from "../models/slider.model"
import User from "../models/user.model"

export const generateToken = (size: number): string => {
    if(size <= 0) return ""
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".repeat(64).split("").sort(() => Math.random() - .5).join("").slice(0, size - 1)
}

export const sliderVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if(!req.body.label) errors.push("The label is required.")

    return errors
}
export const loginVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if(!req.body.email) errors.push("The email is required.")
    if(!req.body.password) errors.push("The password is required.")

    return errors
}
export const groupVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if(!req.body.label) errors.push("The label is required.")
    
    if (!req.body.sliders) req.body.sliders = req.body["sliders[]"]
    if (!Array.isArray(req.body.sliders)) req.body.sliders = [req.body.sliders]
    if(!req.body.sliders || !Array.isArray(req.body.sliders)) errors.push("Sliders are required.")
    else {
        req.body.sliders = req.body.sliders.map((s: string) => parseInt(s)).filter((id: number, i: number, self: number[]) => self.indexOf(id) === i)
        if (req.body.sliders.find((f: number) => isNaN(f))) errors.push("Sliders need to be ids.")
        let sliders = await Promise.all((req.body.sliders as number[]).map((id: number) => Slider.findByPk(id)))
        if (!sliders.filter(f => !!f).length) errors.push("You need at least one slider.")
    }
    return errors
}
export const editGroupVerification = async (req: Request): Promise<string[]> => {
    const errors: string[] = []

    if (!req.body.sliders) req.body.sliders = req.body["sliders[]"]
    if (!Array.isArray(req.body.sliders)) req.body.sliders = [req.body.sliders]
    if(!req.body.sliders || !Array.isArray(req.body.sliders)) errors.push("Sliders are required.")
    else {
        req.body.sliders = req.body.sliders.map((s: string) => parseInt(s)).filter((id: number, i: number, self: number[]) => self.indexOf(id) === i)
        if (req.body.sliders.find((f: number) => isNaN(f))) errors.push("Sliders need to be ids.")
        let sliders = await Promise.all((req.body.sliders as number[]).map((id: number) => Slider.findByPk(id)))
        if (!sliders.filter(f => !!f).length) errors.push("You need at least one slider.")
    }

    return errors
}