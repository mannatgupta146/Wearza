import React from 'react'

const GoogleAuthButton = () => {
  return (
    <a
      href="/api/auth/google"
      className="flex items-center justify-center w-full gap-3 py-2.5 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium text-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
      aria-label="Continue with Google"
    >
      {/* Official Google "G" logo SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="w-5 h-5 flex-shrink-0"
        aria-hidden="true"
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.08-6.08C34.46 3.09 29.5 1 24 1 14.82 1 7.07 6.48 3.64 14.22l7.05 5.48C12.38 13.64 17.73 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.52 24.5c0-1.64-.15-3.22-.42-4.74H24v8.98h12.67c-.55 2.95-2.2 5.45-4.68 7.12l7.19 5.59C43.46 37.54 46.52 31.5 46.52 24.5z"
        />
        <path
          fill="#FBBC05"
          d="M10.69 28.3A14.6 14.6 0 0 1 9.5 24c0-1.49.26-2.93.72-4.28L3.17 14.24A23.03 23.03 0 0 0 1 24c0 3.74.89 7.28 2.46 10.4l7.23-6.1z"
        />
        <path
          fill="#34A853"
          d="M24 47c5.68 0 10.45-1.88 13.93-5.1l-7.19-5.59c-1.88 1.27-4.3 2.02-6.74 2.02-6.27 0-11.62-4.14-13.31-9.72l-7.23 6.1C7.07 41.52 14.82 47 24 47z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
      </svg>
      <span>Continue with Google</span>
    </a>
  )
}

export default GoogleAuthButton