import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.js"
import { useNavigate } from "react-router-dom"

const autofillStyles = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px #121212 inset !important;
    -webkit-text-fill-color: white !important;
    background-color: transparent !important;
    background-image: none !important;
  }
  input::placeholder {
    color: rgb(107, 114, 128) !important;
  }
`

const Login = () => {
  const navigate = useNavigate()
  const { handleLogin } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isSeller: false,
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
    await handleLogin({
      email: formData.email,
      password: formData.password,
      isSeller: formData.isSeller,
    })
    navigate("/home")
  }

  return (
    <>
      <style>{autofillStyles}</style>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
        {/* Main card container */}
        <div className="w-full max-w-md mx-4 relative z-10 rounded-2xl p-8 shadow-2xl border border-gray-800 bg-[#121212]">
          {/* Logo Section */}
          <div className="flex justify-center mb-1">
            <img
              src="/logo.png"
              alt="Wearza Logo"
              className="h-12 w-auto object-contain mb-3"
            />
          </div>

          {/* Heading */}
          <h1 className="text-center text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-gray-400 text-sm mb-8">
            Login to your Wearza account
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  e.target.style.borderBottomColor = "#4b5563"
                }}
                className="w-full bg-transparent text-white placeholder-gray-600 py-2 px-1 border-b-2 border-gray-700 focus:outline-none transition-all duration-300"
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
                  e.target.style.borderBottomColor = "#4b5563"
                }}
                className="w-full bg-transparent text-white placeholder-gray-600 py-2 px-1 border-b-2 border-gray-700 focus:outline-none transition-all duration-300 pr-10"
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
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sellerCheckbox"
                name="isSeller"
                checked={formData.isSeller}
                onChange={handleChange}
                className="w-5 h-5 rounded accent-yellow-400 cursor-pointer"
              />
              <label
                htmlFor="sellerCheckbox"
                className="ml-3 text-white cursor-pointer text-sm"
              >
                Login as Seller
              </label>
            </div>

            <a href="/api/auth/google" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200">
              Continue with Google
            </a>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full mt-8 py-3 px-6 rounded-lg font-semibold text-black text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer bg-linear-to-br from-yellow-400 to-orange-500 shadow-lg"
              onMouseEnter={(e) => {
                e.target.style.boxShadow = "0 15px 40px rgba(255, 140, 0, 0.5)"
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = "0 10px 25px rgba(255, 140, 0, 0.4)"
              }}
            >
              Login
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold transition-all duration-300 hover:opacity-80 bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
