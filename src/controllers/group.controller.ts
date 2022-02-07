import { Request, Response } from "express"
import { hashSync, compareSync } from "bcrypt"
import * as jwt from "jsonwebtoken"
import Group from "../models/group.model"
import Slider from "../models/slider.model"
import { generateToken, loginVerification, registerVerification } from "../utils/verifications"
import Access from "../models/slider.model"
import { REFRESH_EXPIRATION, SIGNATURE } from "../utils/auth.utils"

export default class GroupController {

    public getGroups = async (req: Request, res: Response): Promise<any> => {
 
        Group.findAll({
            include: [{
                model: Slider,
                attributes: ['*'],
            }]
        }).then(async function (groups) {
            if (groups) {
                return res.status(200).json({type: "success", groups: groups});
            } 
            })
            .catch(function (err: string) {
                console.log(err);
                return res.status(500).json({type: 'error', error: err});
        });
    }

    public getGroup = async (req: Request, res: Response): Promise<any> => {
 
        const idGroup = req.params.id;

        Group.findOne({
            include: [{
                model: Slider,
                attributes: ['*'],
            }],
            where: { id: idGroup },
        }).then(async function (group) {
            if (group) {
                return res.status(200).json({type: "success", group: group});
            } 
            })
            .catch(function (err: string) {
                console.log(err);
                return res.status(500).json({type: 'error', error: err});
        });
    }



}