import React from "react"
import { useSelector } from "react-redux"

const SellerProfile = () => {
  const user = useSelector((state) => state.auth.user)
  const initials = (user?.fullname || "S")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0b0b] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 rounded-full bg-amber-400/6 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-orange-500/6 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-white/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.32em] text-amber-200/80">
              Seller Profile
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Your account details.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
              Keep your seller information consistent with the rest of your
              studio.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-gray-800 bg-[#121212]/90 px-4 py-3 text-sm text-gray-300 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            Profile overview
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-start">
          <section className="order-1 rounded-4xl bg-[#111111]/95 p-5 backdrop-blur sm:p-7 xl:col-span-7">
            <div className="flex flex-col gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200/80">
                  Profile Overview
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  Seller account
                </h2>
              </div>

              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#0d0d0d] px-4 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-yellow-300 to-orange-400 text-sm font-semibold text-black">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {user?.fullname || "Seller"}
                  </p>
                  <p className="text-xs text-gray-400">{user?.role || "-"}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-[#0d0d0d] p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Full Name
                </p>
                <p className="mt-2 text-base text-white">
                  {user?.fullname || "-"}
                </p>
              </div>

              <div className="rounded-3xl bg-[#0d0d0d] p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Email Address
                </p>
                <p className="mt-2 text-base text-white">
                  {user?.email || "-"}
                </p>
              </div>

              <div className="rounded-3xl bg-[#0d0d0d] p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Account Type
                </p>
                <p className="mt-2 text-base capitalize text-white">
                  {user?.role || "-"}
                </p>
              </div>

              <div className="rounded-3xl bg-[#0d0d0d] p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Status
                </p>
                <p className="mt-2 text-base font-semibold text-amber-200">
                  Active
                </p>
              </div>
            </div>
          </section>

          <aside className="order-2 xl:sticky xl:top-6 xl:col-span-5 xl:self-start">
            <div className="rounded-[28px] bg-[#121212]/90 p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200/80">
                Quick Notes
              </p>
              <div className="mt-4 space-y-3 text-sm text-gray-400">
                <p>Keep your profile data short and consistent.</p>
                <p>
                  This page now follows the same spacing system as the other
                  seller screens.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default SellerProfile
