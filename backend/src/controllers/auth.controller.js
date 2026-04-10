import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendTokenResponse(user, res, message) {
    const token = jwt.sign(
        { id: user._id }, 
        config.JWT_SECRET, 
        { expiresIn: '7d' })

    res.cookies('token', token)

    res.status(200).json({
        success: true,
        message,
        token,  
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })


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

        const user = new userModel.create({ 
            email, 
            contact, 
            password, 
            fullname,
            role: isSeller ? 'seller' : 'buyer'
        })

        await sendTokenResponse(user, res, 'User registered successfully')

    } catch (error) {
        throw new Error('Error registering user')
    }
}