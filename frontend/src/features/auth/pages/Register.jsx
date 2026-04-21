import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { useAuth } from "../hooks/useAuth.js"
import GoogleAuthButton from "../components/GoogleAuthButton"

const autofillStyles = `
  input:-webkit-autofill,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:hover {
    -webkit-box-shadow: 0 0 0 1000px #121212 inset !important;
    -webkit-text-fill-color: #ffffff !important;
    transition: background-color 9999s ease-out 0s !important;
  }
`

const Register = () => {
  const navigate = useNavigate()
  const { handleRegister } = useAuth()
  const { error } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    isSellerAccount: false,
  })
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
    if (!formData.fullName.trim()) {
      toast.error("Full name is required")
      return
    }
    if (!formData.email.trim()) {
      toast.error("Email is required")
      return
    }
    if (!formData.password.trim()) {
      toast.error("Password is required")
      return
    }
    const result = await handleRegister({
      fullname: formData.fullName,
      email: formData.email,
      password: formData.password,
      isSeller: formData.isSellerAccount,
    })

    if (result?.success) {
      navigate("/")
    }
  }

  return (
    <>
      <style>{autofillStyles}</style>
      <div className="h-screen w-full bg-[#121212] flex overflow-hidden">
        {/* LEFT SECTION (reuse login's visuals) */}
        <div className="relative hidden md:flex w-[50%] h-full items-center justify-start">
          {/* WEARZA CURVED TEXT */}
          <div className="absolute left-[30%] top-1/2 -translate-y-1/2 z-20">
            <svg width="500" height="900" viewBox="0 0 500 900">
              <defs>
                <linearGradient
                  id="wearzaStrokeGradientRegister"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>

                <path
                  id="wearzaCurveRegister"
                  d="M 80 0 A 320 450 0 0 1 80 900"
                  fill="transparent"
                />
              </defs>

              <text
                fill="transparent"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
                fontSize="130"
                letterSpacing="10"
                style={{ textTransform: "uppercase" }}
              >
                <textPath
                  href="#wearzaCurveRegister"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {"WEARZA".split("").map((char, i) => (
                    <tspan
                      key={i}
                      className="transition-all duration-300 cursor-default"
                      onMouseEnter={(e) => {
                        e.target.setAttribute(
                          "stroke",
                          "url(#wearzaStrokeGradientRegister)",
                        )
                        e.target.style.filter =
                          "drop-shadow(0 0 15px rgba(255,200,0,0.9))"
                        e.target.style.transform = "scale(1.1)"
                      }}
                      onMouseLeave={(e) => {
                        e.target.setAttribute("stroke", "rgba(255,255,255,0.2)")
                        e.target.style.filter = "none"
                        e.target.style.transform = "scale(1)"
                      }}
                    >
                      {char}
                    </tspan>
                  ))}
                </textPath>
              </text>
            </svg>
          </div>

          {/* CURVED IMAGE */}
          <div
            className="relative z-10 h-full w-[70%] overflow-hidden shadow-2xl"
            style={{
              borderTopRightRadius: "300px",
              borderBottomRightRadius: "300px",
            }}
          >
            <img
              src="https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Clothing rack with hangers"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT SECTION - match Login form UI */}
        <div className="w-full md:w-[55%] flex items-center justify-center px-8 bg-[#121212] z-30">
          <div className="w-full max-w-md flex flex-col items-center">
            {/* LOGO */}
            <div className="mb-6">
              <img
                src="/logo.png"
                alt="Wearza Logo"
                className="h-10 w-auto object-contain"
              />
            </div>

            {/* HEADING */}
            <div className="text-center mb-8">
              <h1 className="text-3xl text-white font-semibold mb-2">
                Create Account
              </h1>
              <p className="text-gray-400 text-sm">
                Join Wearza and discover premium fashion
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              {/* FULL NAME */}
              <div className="group">
                <div className="border-b border-gray-700 group-hover:border-yellow-400 transition-all">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full bg-transparent py-3 text-white outline-none placeholder-gray-500"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="group">
                <div className="border-b border-gray-700 group-hover:border-yellow-400 transition-all">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full bg-transparent py-3 text-white outline-none placeholder-gray-500"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="group relative">
                <div className="border-b border-gray-700 group-hover:border-yellow-400 transition-all">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full bg-transparent py-3 pr-10 text-white outline-none placeholder-gray-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-3 text-xs text-gray-400 hover:text-yellow-400"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* REGISTER AS SELLER */}
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="sellerRegister"
                  name="isSellerAccount"
                  checked={formData.isSellerAccount}
                  onChange={handleChange}
                  className="accent-yellow-400 w-4 h-4"
                />
                <label
                  htmlFor="sellerRegister"
                  className="text-sm text-gray-300 cursor-pointer"
                >
                  Register as a Seller
                </label>
              </div>

              {/* REGISTER BUTTON */}
              <button
                type="submit"
                className="w-full py-3 mt-3 bg-linear-to-r from-yellow-400 to-orange-400 
                text-black font-semibold rounded-lg transition-all 
                hover:brightness-110 active:scale-[0.97]"
              >
                Register
              </button>

              {/* DIVIDER */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-700" />
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-700" />
              </div>

              {/* GOOGLE */}
              <div className="w-full">
                <GoogleAuthButton />
              </div>

              {/* FOOTER */}
              <p className="text-center text-gray-400 text-sm mt-4">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="cursor-pointer hover:underline bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
