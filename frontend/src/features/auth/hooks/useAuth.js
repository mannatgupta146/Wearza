import { setError, setLoading, setUser } from "../state/auth.slice"
import { loginUser, registerUser } from "../services/auth.api"
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

  return { handleRegister, handleLogin }
}
