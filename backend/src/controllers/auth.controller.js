import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendTokenResponse(user, res) {
    const token = jwt.sign(
        { id: user._id }, 
        config.JWT_SECRET, 
        { expiresIn: '1d' })
}

export const registerController = async (req, res) => {
    try {
        const { email, contact, password, fullname } = req.body
        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or contact number already exists' })
        }

        const user = new userModel.create({ email, contact, password, fullname })

    } catch (error) {
        throw new Error('Error registering user')
    }
}