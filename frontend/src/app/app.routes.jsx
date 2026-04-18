import { createBrowserRouter } from "react-router-dom"
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

const PublicOnlyRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user)

  if (user) {
    return <Navigate to="/home" replace />
  }

  return children
}

export const routes = createBrowserRouter([
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <h1>Home Page</h1>
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <Login />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicOnlyRoute>
        <Register />
      </PublicOnlyRoute>
    ),
  },
])
