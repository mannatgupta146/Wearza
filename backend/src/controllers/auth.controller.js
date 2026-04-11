import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendTokenResponse(user, res, message) {
    const token = jwt.sign(
        { id: user._id }, 
        config.JWT_SECRET, 
        { expiresIn: '7d' })

    res.cookie('token', token)

    res.status(200).json({
        success: true,
        message, 
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
        const { email, contact, password, fullname, isSeller } = req.body

        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })

        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'User with this email or contact number already exists' 
            })
        }

        const user = await userModel.create({ 
            email, 
            contact, 
            password, 
            fullname,
            role: isSeller ? 'seller' : 'buyer'
        })

        await sendTokenResponse(user, res, 'User registered successfully')

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error registering user'
        })
    }
}

export const loginController = async (req, res) => {

    try {
        const { email, contact, password, fullname, isSeller } = req.body

        const user = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })  

        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            })
        }

        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            })
        }

        await sendTokenResponse(user, res, 'User logged in successfully')

    } catch (error) {
        
    }
}

export const googleCallbackController = async (req, res) => {
    try {
        res.redirect('/home')

    } catch (error) {
        
    }
}