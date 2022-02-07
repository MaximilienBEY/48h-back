import { Request, Response } from "express"
import { hashSync, compareSync } from "bcrypt"
import * as jwt from "jsonwebtoken"
import Group from "../models/group.model"
import GroupSlider from "../models/group.slider.model"
import Slider from "../models/slider.model"
import { generateToken, loginVerification } from "../utils/verifications"
import Access from "../models/slider.model"
import { REFRESH_EXPIRATION, SIGNATURE } from "../utils/auth.utils"

export default class GroupController {

    public getGroups = async (req: Request, res: Response): Promise<any> => {
 
        Group.findAll({
            include: [{
                model: GroupSlider,
                attributes: ['id','groupId', 'sliderId', 'position'],
                include: [{
                    model: Slider,
                    attributes: ['id', 'label', 'title', 'mediaType', 'mediaSource', 'createdAt', 'updatedAt']
                }]
            }]
        }).then(async function (groups) {
                if (groups) {
                    return res.status(200).json({type: 'success', groups: groups});
                } 
            })
            .catch(function (err: string) {
                console.log(err);
                return res.status(500).json({type: 'error', error: err});
            });
    }

    public getGroup = async (req: Request, res: Response): Promise<any> => {
 
        const idGroup = req.params.id;

        // console.log(idGroup);
        
        if (idGroup == ':id'){
            return res.status(400).json({type: "erreur", "message" : "Invalid group Id"});
        }

        Group.findOne({
             include: [{
                model: GroupSlider,
                attributes: ['id','groupId', 'sliderId', 'position'],
                include: [{
                    model: Slider,
                    attributes: ['id', 'label', 'title', 'mediaType', 'mediaSource', 'createdAt', 'updatedAt']
                }]
            }],
            where: { id: idGroup },
        }).then(async function (group) {
            if (group) {
                return res.status(200).json({type: 'success', group: group});
            } 
        }).catch(function (err: string) {
            console.log(err);
            return res.status(500).json({type: 'error', error: err});
        });
    }



}