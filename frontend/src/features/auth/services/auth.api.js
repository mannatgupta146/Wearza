import axios from "axios";

const authApi = axios.create({
    baseURL: "http://localhost:5000/api/auth",
    withCredentials: true
})

export async function registerUser({ email, contact, password, fullname }) {
    try {
        const response = await authApi.post("/register", { 
            email, 
            contact, 
            password, 
            fullname 
        });
        
        return response.data;

    } catch (error) {
        throw error;
    }
}