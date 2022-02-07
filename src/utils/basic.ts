import * as jwt from "jsonwebtoken"
import { REFRESH_EXPIRATION, SIGNATURE } from "./auth.utils"

export const generateToken = (size: number): string => {
    return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.repeat(60).split('').sort(() => Math.random() - 0.5).slice(0, size).join('')
}