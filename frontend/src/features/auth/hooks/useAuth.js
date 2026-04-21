import { setError, setLoading, setUser } from "../state/auth.slice"
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/auth.api.js"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"

export const useAuth = () => {
  const dispatch = useDispatch()

  async function handleRegister({
    email,
    password,
    fullname,
    isSeller = false,
  }) {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      const data = await registerUser({ email, password, fullname, isSeller })
      dispatch(setUser(data.user))

      return { success: true, user: data.user }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.msg ||
        "Registration failed"

      dispatch(setError(message))
      toast.error(message)
      return { success: false, message }
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function handleLogin({ email, password, isSeller = false }) {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      const data = await loginUser({ email, password, isSeller })
      dispatch(setUser(data.user))

      return { success: true, user: data.user }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Login failed. Please try again."

      dispatch(setError(message))
      toast.error(message)
      return { success: false, message }
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      const data = await getMe()
      dispatch(setUser(data.user))

      return { success: true, user: data.user }
    } catch (error) {
      const status = error?.response?.status
      const message =
        error?.response?.data?.message || "Failed to fetch user data."

      dispatch(setUser(null))
      dispatch(setError(status === 401 ? null : message))

      if (status !== 401) {
        toast.error(message)
      }
      return { success: false, message }
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function handleLogout() {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      await logoutUser()
      dispatch(setUser(null))

      return { success: true }
    } catch (error) {
      const message = error?.response?.data?.message || "Logout failed"
      dispatch(setError(message))
      toast.error(message)
      return { success: false, message }
    } finally {
      dispatch(setLoading(false))
    }
  }

  return { handleRegister, handleLogin, handleGetMe, handleLogout }
}
