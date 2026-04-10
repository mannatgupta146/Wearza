import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.js"

const Register = () => {

const {handleRegister} = useAuth()
    
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
    isSellerAccount: false,
  })

  const [focusedField, setFocusedField] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleRegister({
        fullname: formData.fullName,
        email: formData.email,
        contact: formData.contactNumber,
        password: formData.password,
        isSeller: formData.isSellerAccount
    })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#0B0B0B" }}
    >
      {/* Subtle gradient glow effect behind the card */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255, 213, 79, 0.05) 0%, transparent 70%)",
        }}
      />

      {/* Main card container */}
      <div
        className="w-full max-w-md mx-4 relative z-10 rounded-2xl p-8 shadow-2xl"
        style={{
          backgroundColor: "#121212",
          boxShadow:
            "0 20px 60px rgba(255, 213, 79, 0.1), 0 0 40px rgba(255, 213, 79, 0.05)",
        }}
      >
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Wearza W Logo with gradient */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="logoGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "#FFD54F", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#FF8C00", stopOpacity: 1 }}
                  />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M 25 35 L 40 65 L 50 50 L 60 75 L 75 35"
                stroke="url(#logoGradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-3xl font-bold text-white mb-2">
          Create Account
        </h1>
        <p className="text-center text-gray-400 text-sm mb-8">
          Join Wearza and discover premium fashion
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Input */}
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              onFocus={(e) => {
                setFocusedField("fullName")
                e.target.style.borderImage =
                  "linear-gradient(90deg, #FFD54F, #FF8C00) 0 0 1 0"
              }}
              onBlur={(e) => {
                setFocusedField(null)
                e.target.style.borderImage = "none"
                e.target.style.borderBottomColor = "#374151"
              }}
              className="w-full bg-transparent text-white placeholder-gray-500 pb-3 border-b-2 border-gray-700 focus:outline-none transition-all duration-300"
              style={{
                borderBottomColor: "#374151",
              }}
            />
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              onFocus={(e) => {
                setFocusedField("email")
                e.target.style.borderImage =
                  "linear-gradient(90deg, #FFD54F, #FF8C00) 0 0 1 0"
              }}
              onBlur={(e) => {
                setFocusedField(null)
                e.target.style.borderImage = "none"
                e.target.style.borderBottomColor = "#374151"
              }}
              className="w-full bg-transparent text-white placeholder-gray-500 pb-3 border-b-2 border-gray-700 focus:outline-none transition-all duration-300"
              style={{
                borderBottomColor: "#374151",
              }}
            />
          </div>

          {/* Contact Number Input */}
          <div>
            <input
              type="tel"
              name="contactNumber"
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={handleChange}
              onFocus={(e) => {
                setFocusedField("contactNumber")
                e.target.style.borderImage =
                  "linear-gradient(90deg, #FFD54F, #FF8C00) 0 0 1 0"
              }}
              onBlur={(e) => {
                setFocusedField(null)
                e.target.style.borderImage = "none"
                e.target.style.borderBottomColor = "#374151"
              }}
              className="w-full bg-transparent text-white placeholder-gray-500 pb-3 border-b-2 border-gray-700 focus:outline-none transition-all duration-300"
              style={{
                borderBottomColor: "#374151",
              }}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onFocus={(e) => {
                setFocusedField("password")
                e.target.style.borderImage =
                  "linear-gradient(90deg, #FFD54F, #FF8C00) 0 0 1 0"
              }}
              onBlur={(e) => {
                setFocusedField(null)
                e.target.style.borderImage = "none"
                e.target.style.borderBottomColor = "#374151"
              }}
              className="w-full bg-transparent text-white placeholder-gray-500 pb-3 border-b-2 border-gray-700 focus:outline-none transition-all duration-300 pr-10"
              style={{
                borderBottomColor: "#374151",
              }}
            />
            {/* Eye Icon Button */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 bottom-3 text-gray-400 hover:text-yellow-400 transition-colors duration-200 focus:outline-none"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753-4.753m7.538 12.758a4.5 4.5 0 01-7.588-4.003M9.75 9.75l4.5 4.5M9.75 15.75l5.25-5.25"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Seller Checkbox */}
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              id="sellerCheckbox"
              name="isSellerAccount"
              checked={formData.isSellerAccount}
              onChange={handleChange}
              className="w-5 h-5 rounded accent-yellow-400 cursor-pointer"
            />
            <label
              htmlFor="sellerCheckbox"
              className="ml-3 text-white cursor-pointer text-sm"
            >
              Register as Seller
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full mt-8 py-3 px-6 rounded-lg font-semibold text-black text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
            style={{
              background: "linear-gradient(135deg, #FFD54F, #FF8C00)",
              boxShadow: "0 10px 30px rgba(255, 140, 0, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = "0 15px 40px rgba(255, 140, 0, 0.5)"
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = "0 10px 30px rgba(255, 140, 0, 0.3)"
            }}
          >
            Register
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold transition-all duration-300 hover:opacity-80"
              style={{
                background: "linear-gradient(135deg, #FFD54F, #FF8C00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
