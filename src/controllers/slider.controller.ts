import * as fs from "fs"
import { Request, Response } from "express"
import Slider from "../models/slider.model"
import { sliderVerification } from "../utils/verifications"
import { randomUUID } from "crypto"
import getSocket from "../socket"

export default class SliderController {

    private socket: ReturnType<typeof getSocket>
    public constructor(socket: ReturnType<typeof getSocket>) {
        this.socket = socket
    }
    
    public createSlider = async (req: Request, res: Response) => {
        let errors = await sliderVerification(req)
        if (errors.length) return res.status(400).json({ type: "error", errors })
        if (!req.body.title && (!req.files || !req.files["media"])) return res.status(400).json({type: "error", errors: ["Title or media is required."]})

        let mediaName: string | undefined = undefined
        let mediaType: "image" | "video" | undefined = undefined 

        if (req.files && req.files["media"]) {
            let media = req.files["media"]
            if (Array.isArray(media)) return res.status(400).json({ type: "error", errors: ["Media need to contains only one file."] })
            if (!media.mimetype.startsWith("image/") && !media.mimetype.startsWith("video/")) return res.status(400).json({ type: "error", errors: ["The media need to be an image or a video."] })
            
            let extension = media.name.split(".").pop()
            mediaName = `${randomUUID()}${extension ? `.${extension}` : ""}`
            mediaType = media.mimetype.startsWith("image/") ? "image" : "video"
            !fs.existsSync(`./cdn`) && fs.mkdirSync(`./cdn`) 
            await media.mv(`./cdn/${mediaName}`)
        }

        let slider = await Slider.create({
            label: req.body.label,
            title: req.body.title,
            mediaSource: mediaName,
            mediaType: mediaType
        })

        res.send({
            type: "success",
            slider
        })
    }
    public getSliders = async (req: Request, res: Response) => {        
        res.send({
            type: "success",
            sliders: await Slider.findAll()
        })
    }
    public getSlider = async (req: Request, res: Response) => {
        let slider = await Slider.findByPk(req.params.id)
        if (!slider) return res.status(400).json({ type: "error", errors: ["The slider doesn't exist."] })
        
        res.send({
            type: "success",
            slider
        })
    }
    public editSlider = async (req: Request, res: Response) => {
        let slider = await Slider.findByPk(req.params.id)
        if (!slider) return res.status(400).json({ type: "error", errors: ["The slider doesn't exist."] })

        if (req.body.label) slider.label = req.body.label
        if (req.body.title) slider.title = req.body.title
        
        let media = req.files?.media
        if (media && !Array.isArray(media)) {
            if (!media.mimetype.startsWith("image/") && !media.mimetype.startsWith("video/")) return res.status(400).json({ type: "error", errors: ["The media need to be an image or a video."] })

            let extension = media.name.split(".").pop()
            let mediaName = `${slider.mediaSource ? slider.mediaSource.split(".").shift() : randomUUID()}${extension ? `.${extension}` : ""}`
            fs.existsSync(`./cdn/${slider.mediaSource}`) && fs.rmSync(`./cdn/${slider.mediaSource}`)
            await media.mv(`./cdn/${mediaName}`)
            slider.mediaSource = mediaName
            slider.mediaType = media.mimetype.startsWith("image/") ? "image" : "video"
        }

        await slider.save()

        let gSliders = await slider.getGroupSliders()
        await Promise.all(gSliders.map(async gSlider => {
            let group = await gSlider.getGroup()
            if (!group) return

            this.socket.emit("groupChange", group.id)
        }))

        res.send({
            type: "success",
            slider
        })
    }
    public deleteSlider = async (req: Request, res: Response) => {
        let slider = await Slider.findByPk(req.params.id)
        if (!slider) return res.status(400).json({ type: "error", errors: ["The slider doesn't exist."] })

        await slider.destroy()
        // emit
        res.send({
            type: "success",
            message: "Slider successfully deleted."
        })
    }
}