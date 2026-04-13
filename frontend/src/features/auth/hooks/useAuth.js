import { setError, setLoading, setUser } from "../state/auth.slice"
import { loginUser, registerUser } from "../services/auth.api"
import { useDispatch } from "react-redux"

export const useAuth = () => {
  const dispatch = useDispatch()

  async function handleRegister({
    email,
    password,
    fullname,
    isSeller = false,
  }) {
    const data = await registerUser({ email, password, fullname, isSeller })

    dispatch(setUser(data.user))
  }

  async function handleLogin({ email, password, isSeller = false }) {
    const data = await loginUser({ email, password, isSeller })

    dispatch(setUser(data.user))
  }

  return { handleRegister, handleLogin }
}
