import { Request, Response } from "express"
import Group from "../models/group.model"
import GroupSlider from "../models/group.slider.model"
import Slider from "../models/slider.model"
import { editGroupVerification, groupVerification } from "../utils/verifications"
import { SliderAttributes } from "../models/slider.model"
import getSocket from "../socket"

export default class GroupController {

    private socket: ReturnType<typeof getSocket>
    public constructor(socket: ReturnType<typeof getSocket>) {
        this.socket = socket
    }

    public getGroups = async (req: Request, res: Response): Promise<any> => {
        let groups = await Group.findAll()

        res.json({
            type: "success",
            groups: await Promise.all(groups.map(async group => ({
                ...group.toJSON(),
                slides: (await group.getGroupSliders()).length
            })))
        })
    }

    public detailGroup = async (req: Request, res: Response): Promise<any> => {
        let group = await Group.findByPk(req.params.id)
        if (!group) return res.status(400).json({ type: "error", errors: ["The group doesn't exist."] })

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
            group: {
                ...group.toJSON(),
                slides: (await group.getGroupSliders()).length
            }
        })
    }

    public editGroup = async (req: Request, res: Response): Promise<any> => {
        let group = await Group.findByPk(req.params.id)
        if (!group) return res.status(400).json({ type: "error", errors: ["The group doesn't exist."] })

        let errors = await editGroupVerification(req)
        if (errors.length) return res.status(400).json({ type: "error", errors })

        if (req.body.label) group.label = req.body.label
        await group.save()

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

        this.socket.emit("groupChange", group.id)

        res.json({
            type: "success",
            message: "Group successfully edited."
        })
    }

    public deleteGroup = async (req: Request, res: Response): Promise<any> => {
        let group = await Group.findByPk(req.params.id)
        if (!group) return res.status(400).json({ type: "error", errors: ["The group doesn't exist."] })

        await group.destroy()

        this.socket.emit("groupDelete", group.id)

        res.json({
            type: "success",
            message: "Group successfully deleted."
        })
    }
}