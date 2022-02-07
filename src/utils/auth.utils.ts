import { Request } from "express";
import * as jwt from "jsonwebtoken"
import Group from "../models/group.model";
import Access from "../models/slider.model";
import User from "../models/user.model"
import Admin from "../models/user.model";

export const SIGNATURE = "CSTSSJKXDOKJS6YD4SO6H3TF6VCXNNBK"
export const REFRESH_EXPIRATION = 14 // Days

export const getUser = async (req: Request): Promise<Admin|null> => {
    if(!req.headers.authorization) return null
    try {
        let data = jwt.verify(req.headers.authorization.replace("Bearer ", ""), SIGNATURE) as {userId: number, iat: number}
        let user = await User.findOne({where: {id: data.userId}})

        return user
    } catch (error) {
        return null
    }
}