import { setError, setLoading, setUser } from "../state/auth.slice";
import { registerUser } from "../services/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {

    const dispatch = useDispatch()

    async function handleRegister({ email, contact, password, fullname }) {

        const data = await registerUser({ email, contact, password, fullname })

        dispatch(setUser(data.user))
    }

    return {handleRegister}
}