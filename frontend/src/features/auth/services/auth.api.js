import axios from "axios"

const authApi = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
})

export async function registerUser({ email, password, fullname, isSeller }) {
  try {
    const response = await authApi.post("/register", {
      email,
      password,
      fullname,
      isSeller,
    })

    return response.data
  } catch (error) {
    throw error
  }
}

export async function loginUser({ email, password, isSeller }) {
  try {
    const response = await authApi.post("/login", {
      email,
      password,
      isSeller,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export async function getMe() {
  try {
    const response = await authApi.get("/me")
    return response.data
  } catch (error) {
    throw error
  }
}

export async function logoutUser() {
  try {
    const response = await authApi.post("/logout")
    return response.data
  } catch (error) {
    throw error
  }
}
