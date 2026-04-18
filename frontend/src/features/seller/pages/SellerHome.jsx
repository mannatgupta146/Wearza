import React from "react"

const SellerHome = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-yellow-300/80">
          Home
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Home Page</h1>
        <p className="mt-3 text-sm text-gray-400">
          Welcome to your seller area. Use the sidebar to create products,
          manage your dashboard, and update your profile.
        </p>
      </div>
    </div>
  )
}

export default SellerHome
