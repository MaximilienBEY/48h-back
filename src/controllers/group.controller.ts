import { Request, Response } from "express"
import { hashSync, compareSync } from "bcrypt"
import * as jwt from "jsonwebtoken"
import User from "../models/user.model"
import { generateToken, loginVerification } from "../utils/verifications"
import Access from "../models/slider.model"
import { REFRESH_EXPIRATION, SIGNATURE } from "../utils/auth.utils"

export default class GroupController {



}