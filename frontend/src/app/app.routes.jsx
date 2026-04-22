import { createBrowserRouter } from "react-router-dom"
import { Navigate } from "react-router-dom"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import CreateProduct from "../features/products/pages/CreateProduct"
import Dashboard from "../features/products/pages/Dashboard"
import SellerLayout from "../features/products/components/SellerLayout"
import SellerProfile from "../features/products/pages/SellerProfile"
import Protected from "../features/auth/components/Protected"
import PublicOnly from "../features/auth/components/PublicOnly"
import Home from "../features/products/pages/Home"
import ProductDetails from "../features/products/pages/ProductDetails"
import SellerProductDetails from "../features/products/pages/SellerProductDetails"
import Cart from "../features/cart/pages/Cart"
import AppLayout from "./AppLayout"

export const routes = createBrowserRouter([
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
        element: <Navigate to="/seller/dashboard" replace />,
      },
      {
        path: "create-product",
        element: <CreateProduct />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <SellerProfile />,
      },
      {
        path: "product/:productId",
        element: <SellerProductDetails />,
      }
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

  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/cart",
        element: (
          <Protected>
            <Cart />
          </Protected>
        ),
      },

      {
        path: "/product/:productId",
        element: <ProductDetails />,
      },
    ]
  }

])
