import { createBrowserRouter } from "react-router-dom"
import { Navigate } from "react-router-dom"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import CreateProduct from "../features/products/pages/CreateProduct"
import Dashboard from "../features/products/pages/Dashboard"
import Protected from "../features/auth/components/Protected"
import PublicOnly from "../features/auth/components/PublicOnly"
import SellerLayout from "../features/seller/components/SellerLayout"
import SellerHome from "../features/seller/pages/SellerHome"
import SellerProfile from "../features/seller/pages/SellerProfile"

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <h1>Home Page</h1>
      </Protected>
    ),
  },
  {
    path: "/seller",
    element: (
      <Protected role="seller">
        <SellerLayout />
      </Protected>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/seller/home" replace />,
      },
      {
        path: "create-product",
        element: <CreateProduct />,
      },
      {
        path: "home",
        element: <SellerHome />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <SellerProfile />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicOnly>
        <Login />
      </PublicOnly>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicOnly>
        <Register />
      </PublicOnly>
    ),
  },
])
