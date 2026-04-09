import {Router} from "express"
import { validateRegisterUser } from "../validators/auth.validator"

const authRouter = Router()

/**
 * @route POST /auth/login
 * @desc Login user and return JWT token
 * @access Public
 */

authRouter.post('login')

/**
 * @route POST /auth/register
 * @desc Register a new user and return JWT token
 * @access Public
 */

authRouter.post('register', validateRegisterUser)

/**
 * @route POST /auth/logout
 * @desc Logout user by clearing JWT token
 * @access Private
 */

authRouter.post('logout')

export default authRouter