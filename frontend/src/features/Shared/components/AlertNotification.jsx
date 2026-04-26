import React from "react"

const AlertNotification = ({ closeToast, toastProps }) => {
    const { message, type } = toastProps.data || { message: toastProps.children, type: 'info' }

    const isSuccess = type === 'success' || type === 'info'
    const isError = type === 'error' || type === 'warning'
    
    return (
        <div className="relative p-8 w-full min-w-[340px] overflow-hidden group">
            {/* Atmospheric Background Glow */}
            <div className={`absolute -right-20 -top-20 w-40 h-40 blur-[80px] opacity-30 rounded-full transition-all duration-700 ${
                isSuccess ? 'bg-amber-500' : 'bg-rose-600'
            }`} />

            {/* Close Button */}
            <button 
                onClick={closeToast}
                className="absolute top-6 right-6 p-1 text-white/20 hover:text-white transition-all duration-300 z-50 hover:rotate-90"
                aria-label="Close notification"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="flex items-center gap-6 relative z-10">
                {/* Icon Orb */}
                <div className={`h-12 w-12 shrink-0 rounded-full border flex items-center justify-center transition-all duration-500 ${
                    isSuccess 
                    ? "bg-amber-400/10 border-amber-400/20 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.1)]" 
                    : "bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.1)]"
                }`}>
                    {isSuccess ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 pr-4">
                    <p className={`text-[10px] font-black uppercase tracking-[0.5em] mb-2 ${
                        isSuccess ? "text-amber-400" : "text-rose-500"
                    }`}>
                        {isSuccess ? "Notification" : "System Alert"}
                    </p>
                    <p className="text-[15px] font-light text-white/90 tracking-tight leading-snug italic">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AlertNotification
