import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
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

const Login = () => {
  const navigate = useNavigate()
  const { handleLogin } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isSeller: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
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
    if (!formData.email.trim()) {
      toast.error("Email is required")
      return
    }
    if (!formData.password.trim()) {
      toast.error("Password is required")
      return
    }
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      await handleLogin({
        email: formData.email,
        password: formData.password,
        isSeller: formData.isSeller,
      })
      navigate("/home")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <style>{autofillStyles}</style>

      <div className="h-screen w-full bg-[#121212] flex overflow-hidden">
        {/* LEFT SECTION */}
        <div className="relative hidden md:flex w-[50%] h-full items-center justify-start">
          {/* 🔥 VERTICAL LOG IN TEXT */}
          <div className="absolute left-[30%] top-1/2 -translate-y-1/2 z-20">
            <svg width="500" height="900" viewBox="0 0 500 900">
              <defs>
                <linearGradient
                  id="wearzaStrokeGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>

                <path
                  id="wearzaCurve"
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
                  href="#wearzaCurve"
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
                          "url(#wearzaStrokeGradient)",
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
              src="https://images.pexels.com/photos/3735641/pexels-photo-3735641.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Model wearing fashionable outfit"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
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
            <div className="text-center mb-10">
              <h1 className="text-3xl text-white font-semibold mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-400 text-sm">
                Login to continue your fashion journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-8">
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

              {/* ✅ LOGIN AS SELLER */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="seller"
                  name="isSeller"
                  checked={formData.isSeller}
                  onChange={handleChange}
                  className="accent-yellow-400 w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="seller"
                  className="text-sm text-gray-300 cursor-pointer"
                >
                  Login as a Seller
                </label>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 mt-4 bg-linear-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg transition-all hover:brightness-110 active:scale-[0.97] ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "Logging in..." : "Login"}
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
                Don’t have an account?{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="text-yellow-400 cursor-pointer hover:underline"
                >
                  Register
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
