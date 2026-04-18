import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"

export const sendTokenResponse = async (user, res, message) => {
  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  })

  res.cookie("token", token)

  res.status(200).json({
    success: true,
    message,
    user: {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
    },
  })
}

export const getMeController = async (req, res) => {
  try {
    const user = req.user

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
    })
  }
}

export const registerController = async (req, res) => {
  try {
    const { email, password, fullname, isSeller } = req.body

    const existingUser = await userModel.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      })
    }

    const user = await userModel.create({
      email,
      password,
      fullname,
      role: isSeller ? "seller" : "buyer",
    })

    await sendTokenResponse(user, res, "User registered successfully")
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error registering user",
    })
  }
}

export const loginController = async (req, res) => {
  try {
    const { email, password, isSeller = false } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    const requestedRole = isSeller ? "seller" : "buyer"
    if (user.role !== requestedRole) {
      return res.status(403).json({
        success: false,
        message: isSeller
          ? "This account is not registered as a seller"
          : "This account is a seller account. Please enable seller login.",
      })
    }

    await sendTokenResponse(user, res, "User logged in successfully")
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging in user",
    })
  }
}

export const logoutController = async (req, res) => {
  try {
    res.clearCookie("token")
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error logging out user",
    })
  }
}

export const googleCallbackController = async (req, res) => {
  try {
    const { id, displayName, emails, photos } = req.user

    const email = emails[0].value
    const profilePic = photos[0].value

    let user = await userModel.findOne({ email })

    if (!user) {
      user = await userModel.create({
        email,
        fullname: displayName,
        googleId: id,
      })
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    })

    res.cookie("token", token)

    res.redirect("http://localhost:5173/")
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error during Google authentication",
    })
  }
}
