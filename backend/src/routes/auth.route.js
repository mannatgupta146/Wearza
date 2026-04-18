import { Router } from "express"
import {
  validateLoginUser,
  validateRegisterUser,
} from "../validators/auth.validator.js"
import {
  getMeController,
  googleCallbackController,
  loginController,
  logoutController,
  registerController,
} from "../controllers/auth.controller.js"
import passport from "passport"
import { authenticateUser } from "../middleware/auth.middleware.js"

const authRouter = Router()

/**
 * @route GET /auth/me
 * @desc Get current authenticated user
 * @access Private
 */

authRouter.get("/me", authenticateUser, getMeController)

/**
 * @route POST /auth/login
 * @desc Login user and return JWT token
 * @access Public
 */

authRouter.post("/login", validateLoginUser, loginController)

/**
 * @route POST /auth/register
 * @desc Register a new user and return JWT token
 * @access Public
 */

authRouter.post("/register", validateRegisterUser, registerController)

/**
 * @route POST /auth/logout
 * @desc Logout user by clearing JWT token
 * @access Private
 */

authRouter.post("/logout", logoutController)

/**
 * @route GET /auth/google
 * @desc Authenticate user with Google OAuth
 * @access Public
 */

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
)

/**
 * @route GET /auth/google/callback
 * @desc Google OAuth callback URL
 * @access Public
 */

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  googleCallbackController,
)

export default authRouter
