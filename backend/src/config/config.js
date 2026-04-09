import dotenv from 'dotenv';

dotenv.config();

if(!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in the environment variables.');
    process.exit(1);
}

if(!process.env.JWT_SECRET) {
    console.error('Error: JWT_SECRET is not defined in the environment variables.');
    process.exit(1);
}

export const config = {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/snitch',
    JWT_SECRET: process.env.JWT_SECRET
}