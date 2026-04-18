import React from "react"
import { useSelector } from "react-redux"

const SellerProfile = () => {
  const user = useSelector((state) => state.auth.user)

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-yellow-300/80">
          Profile
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          Seller Profile
        </h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-[#1a1a1a] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Name
            </p>
            <p className="mt-2 text-sm text-white">{user?.fullname || "-"}</p>
          </div>
          <div className="rounded-xl bg-[#1a1a1a] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Email
            </p>
            <p className="mt-2 text-sm text-white">{user?.email || "-"}</p>
          </div>
          <div className="rounded-xl bg-[#1a1a1a] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Role
            </p>
            <p className="mt-2 text-sm capitalize text-white">
              {user?.role || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerProfile
