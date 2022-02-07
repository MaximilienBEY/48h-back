import * as fs from "fs"
import { Request, Response } from "express"
import Slider from "../models/slider.model"
import { sliderVerification } from "../utils/verifications"
import { randomUUID } from "crypto"

export default class SliderController {
    public createSlider = async (req: Request, res: Response) => {
        let errors = await sliderVerification(req)
        if (errors.length) return res.status(400).json({ type: "error", errors })
        if (!req.files || !req.files["media"]) return res.status(400).json({ type: "error", errors: ["Le media est obligatoire."] })

        let media = req.files["media"]
        if (Array.isArray(media)) return res.status(400).json({ type: "error", errors: ["Le media ne doit contenir qu'un fichier."] })
        if (!media.mimetype.startsWith("image/") && !media.mimetype.startsWith("video/")) return res.status(400).json({ type: "error", errors: ["Le media ne peut être qu'une image ou vidéo."] })
        
        let extension = media.name.split(".").pop()
        let mediaName = `${randomUUID()}${extension ? `.${extension}` : ""}`
        !fs.existsSync(`./cdn`) && fs.mkdirSync(`./cdn`) 
        await media.mv(`./cdn/${mediaName}`)

        let slider = await Slider.create({
            label: req.body.label,
            title: req.body.title,
            mediaSource: mediaName,
            mediaType: media.mimetype.startsWith("image/") ? "image" : "video"
        })

        res.send({
            type: "success",
            slider
        })
    }
    public getSlider = async (req: Request, res: Response) => {
        let slider = await Slider.findByPk(req.params.id)
        if (!slider) return res.status(400).json({ type: "error", errors: ["Le slider n'existe pas."] })
        
        res.send({
            type: "success",
            slider
        })
    }
    public editSlider = async (req: Request, res: Response) => {
        let slider = await Slider.findByPk(req.params.id)
        if (!slider) return res.status(400).json({ type: "error", errors: ["Le slider n'existe pas."] })

        if (req.body.label) slider.label = req.body.label
        if (req.body.title) slider.title = req.body.title
        
        let media = req.files?.media
        if (media && !Array.isArray(media)) {
            if (!media.mimetype.startsWith("image/") && !media.mimetype.startsWith("video/")) return res.status(400).json({ type: "error", errors: ["Le media ne peut être qu'une image ou vidéo."] })

            let extension = media.name.split(".").pop()
            let mediaName = `${slider.mediaSource.split(".").shift()}${extension ? `.${extension}` : ""}`
            fs.rmSync(`./cdn/${slider.mediaSource}`)
            await media.mv(`./cdn/${mediaName}`)
            slider.mediaSource = mediaName
            slider.mediaType = media.mimetype.startsWith("image/") ? "image" : "video"
        }

        await slider.save()
        res.send({
            type: "success",
            slider
        })
    }
    public deleteSlider = async (req: Request, res: Response) => {
        let slider = await Slider.findByPk(req.params.id)
        if (!slider) return res.status(400).json({ type: "error", errors: ["Le slider n'existe pas."] })

        await slider.destroy()
        // emit
        res.send({
            type: "success",
            message: "Slider supprimé avec succès."
        })
    }
}