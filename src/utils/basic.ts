import * as jwt from "jsonwebtoken"
import { Token } from "../interfaces/auth.interface"
import { REFRESH_EXPIRATION, SIGNATURE } from "./auth.utils"

export const generateToken = (size: number): string => {
    return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.repeat(60).split('').sort(() => Math.random() - 0.5).slice(0, size).join('')
}

export const getToken = (session: string, refresh: string): Token => {
    return {
        session: jwt.sign({ token: session }, SIGNATURE),
        refresh: jwt.sign({ token: refresh }, SIGNATURE, { expiresIn: `${REFRESH_EXPIRATION}d` }),
    }
}