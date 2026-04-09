import mongoose, { connect } from "mongoose"
import { config } from "./config.js"

export const connectDB = async () => {
    await mongoose.connect(config.MONGODB_URI)
    console.log('Connected to MongoDB');
}

export default connectDB