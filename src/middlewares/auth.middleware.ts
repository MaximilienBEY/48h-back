import { NextFunction, Request, Response } from "express";
import { getUser } from "../utils/auth.utils";

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    let user = await getUser(req)
    if(!user) return res.status(401).json({type: "error", errors: ["Unauthorized"]})
    next()
}