import { Request, Response } from "express"
import { hashSync, compareSync } from "bcrypt"
import * as jwt from "jsonwebtoken"
import User from "../models/user.model"
import { generateToken, loginVerification } from "../utils/verifications"
import Access, { SliderAttributes } from "../models/slider.model"
import { REFRESH_EXPIRATION, SIGNATURE } from "../utils/auth.utils"
import Group from "../models/group.model"
import Slider from "../models/slider.model"

interface SliderValues extends SliderAttributes {
    position: number;
    createdAt: Date;
    updatedAt: Date;
}

export default class GroupController {

    public async getSlider() {
        let group = await Group.findByPk(1)
        if (!group) return

        let sliders: SliderValues[] = await Promise.all((await group.getGroupSliders()).map(async gSlider => {
            let slider = await gSlider.getSlider() as Slider
            return {
                position: gSlider.position,
                id: slider.id,
                label: slider.label,
                title: slider.title,
                mediaType: slider.mediaType as SliderValues["mediaType"],
                mediaSource: slider.mediaSource,
                createdAt: slider.createdAt,
                updatedAt: slider.updatedAt
            }
        }))
    }

}