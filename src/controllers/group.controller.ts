import { Request, Response } from "express"
import Group from "../models/group.model"
import GroupSlider from "../models/group.slider.model"
import Slider from "../models/slider.model"
import { editGroupVerification, groupVerification } from "../utils/verifications"
import { SliderAttributes } from "../models/slider.model"

export default class GroupController {

    public getGroups = async (req: Request, res: Response): Promise<any> => {
        let groups = await Group.findAll()

        res.json({
            type: "success",
            groups
        })
    }

    public detailGroup = async (req: Request, res: Response): Promise<any> => {
        let group = await Group.findByPk(req.params.id)
        if (!group) return res.status(400).json({ type: "error", errors: ["Le groupe n'existe pas."] })

        let gSliders = await group.getGroupSliders()
        let sliders = await Promise.all(gSliders.map(async gSlider => {
            let slider = await gSlider.getSlider() as Slider
            return {
                position: gSlider.position,
                id: slider.id as number,
                label: slider.label,
                title: slider.title,
                mediaType: slider.mediaType as SliderAttributes["mediaType"],
                mediaSource: slider.mediaSource,
                createdAt: slider.createdAt,
                updatedAt: slider.updatedAt
            }
        }))

        res.json({
            type: "success",
            group: {
                ...group.toJSON(),
                sliders: sliders.sort((a, b) => a.position - b.position)
            }
        })
    }

    public createGroup = async (req: Request, res: Response): Promise<any> => {
        let errors = await groupVerification(req)
        if (errors.length) return res.status(400).json({ type: "error", errors })

        let group = await Group.create({
            label: req.body.label
        })
        await Promise.all((req.body.sliders as number[]).map(async (id, i) => {
            let slider = await Slider.findByPk(id)
            if (!slider) return

            await GroupSlider.create({
                position: i,
                groupId: group.id,
                sliderId: slider.id
            })
        }))

        res.json({
            type: "success",
            message: "Le groupe a bien été créé."
        })
    }

    public editGroup = async (req: Request, res: Response): Promise<any> => {
        let group = await Group.findByPk(req.params.id)
        if (!group) return res.status(400).json({ type: "error", errors: ["Le groupe n'existe pas."] })

        let errors = await editGroupVerification(req)
        if (errors.length) return res.status(400).json({ type: "error", errors })

        if (req.body.label) group.label = req.body.label

        let s = req.body.sliders as number[]
        let gSliders = await group.getGroupSliders()
        await Promise.all(gSliders.map(async gSlider => !s.includes(gSlider.id) && gSlider.destroy()))

        await Promise.all(s.map(async (id, i) => {
            let slider = await Slider.findByPk(id)
            if (!slider || !group) return

            let gSlider = await GroupSlider.findOne({
                where: {
                    sliderId: slider.id,
                    groupId: group.id
                }
            })
            if (gSlider) {
                gSlider.position = i
                await gSlider.save()
            } else {
                await GroupSlider.create({
                    position: i,
                    groupId: group.id,
                    sliderId: slider.id
                })
            }
        }))

        res.json({
            type: "success",
            message: "Le groupe a bien été modifié."
        })
    }

    public deleteGroup = async (req: Request, res: Response): Promise<any> => {
        let group = await Group.findByPk(req.params.id)
        if (!group) return res.status(400).json({ type: "error", errors: ["Le groupe n'existe pas."] })

        await group.destroy()

        res.json({
            type: "success",
            message: "Groupe supprimé avec succès."
        })
    }
}