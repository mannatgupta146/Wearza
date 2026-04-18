import { createSlice } from "@reduxjs/toolkit";

function getPersistedUser() {
    if (typeof window === "undefined") return null

    const rawUser = window.localStorage.getItem("wearza_user")
    if (!rawUser) return null

    try {
        return JSON.parse(rawUser)
    } catch {
        window.localStorage.removeItem("wearza_user")
        return null
    }
}

function persistUser(user) {
    if (typeof window === "undefined") return

    if (user) {
        window.localStorage.setItem("wearza_user", JSON.stringify(user))
    } else {
        window.localStorage.removeItem("wearza_user")
    }
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: getPersistedUser(),
        loading: false,
        error: null    
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            persistUser(action.payload)
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setUser, setLoading, setError } = authSlice.actions

export default authSlice.reducer