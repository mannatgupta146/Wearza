import {Router} from "express"
import { validateLoginUser, validateRegisterUser } from "../validators/auth.validator.js"
import { loginController, registerController } from "../controllers/auth.controller.js"

const authRouter = Router()

/**
 * @route POST /auth/login
 * @desc Login user and return JWT token
 * @access Public
 */

authRouter.post('/login', validateLoginUser, loginController)

/**
 * @route POST /auth/register
 * @desc Register a new user and return JWT token
 * @access Public
 */

authRouter.post('/register', validateRegisterUser, registerController)

/**
 * @route POST /auth/logout
 * @desc Logout user by clearing JWT token
 * @access Private
 */

/* authRouter.post('/logout') */

export default authRouter