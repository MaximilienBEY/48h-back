import { NextFunction, Request, Response } from "express";
import { getUser } from "../utils/auth.utils";

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    let user = await getUser(req)
    if(!user) return res.status(403).json({type: "error", errors: ["Forbidden"]})
    
    next()
}