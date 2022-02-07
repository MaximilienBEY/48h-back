import * as fs from "fs"
import { Request, Response } from "express"
import Slider from "../models/slider.model"
import { sliderVerification } from "../utils/verifications"
import { randomUUID } from "crypto"

export default class SliderController {
    public async createSlider(req: Request, res: Response) {
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
}