import React from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useAuth } from "../../auth/hooks/useAuth"

const links = [
  { to: "/seller/dashboard", label: "Dashboard" },
  { to: "/seller/create-product", label: "Create Product" },
  { to: "/seller/profile", label: "Profile" },
]

const SellerLayout = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const { handleLogout } = useAuth()

  const onLogout = async () => {
    await handleLogout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white md:flex">
      <aside className="border-b border-white/10 bg-[#121212] md:fixed md:inset-y-0 md:left-0 md:flex md:w-72 md:flex-col md:border-b-0 md:border-r md:border-white/10">
        <div className="flex items-center gap-3 px-5 py-5">
          <img
            src="/logo.png"
            alt="Wearza logo"
            className="h-8 w-8 rounded-lg object-contain"
          />
          <h2 className="text-xl font-semibold">Wearza</h2>
        </div>

        <nav className="grid grid-cols-2 gap-2 px-4 pb-4 md:flex-1 md:auto-rows-min md:grid-cols-1 md:content-start md:pb-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-linear-to-r from-yellow-300 to-orange-400 text-black"
                    : "bg-[#1a1a1a] text-gray-200 hover:bg-[#232323]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-5 py-4 md:mt-auto">
          <p className="text-sm font-medium text-white">
            {user?.fullname || "Seller"}
          </p>
          <p className="text-xs text-gray-400">{user?.email || ""}</p>
          <button
            type="button"
            onClick={onLogout}
            className="mt-3 w-full rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 transition-all hover:bg-red-500/20"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-72">
        <Outlet />
      </main>
    </div>
  )
}

export default SellerLayout
