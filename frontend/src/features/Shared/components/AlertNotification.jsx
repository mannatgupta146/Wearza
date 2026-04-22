import React from "react"

const AlertNotification = ({ closeToast, toastProps }) => {
    const { message, type } = toastProps.data

    const isWarning = type === 'warning'
    
    return (
        <div className="relative p-5 w-full">
            {/* Topmost Right Close Button */}
            <button 
                onClick={closeToast}
                className="absolute top-2.5 right-2.5 p-1.5 text-white/30 hover:text-white transition-colors duration-300 z-50 group"
                aria-label="Close notification"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="flex items-center gap-4">
                {/* Icon Frame */}
                <div className={`relative h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center ${
                    isWarning ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 opacity-50">
                        {isWarning ? "System Alert" : "Error"}
                    </p>
                    <p className="text-xs font-bold text-white tracking-tight leading-relaxed">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AlertNotification
