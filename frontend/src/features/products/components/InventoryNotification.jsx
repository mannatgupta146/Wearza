import React from "react"

const InventoryNotification = ({ closeToast, toastProps }) => {
    const { title } = toastProps.data

    return (
        <div className="relative p-8 w-full min-w-[340px] overflow-hidden group">
            {/* Atmospheric Background Glow */}
            <div className="absolute -right-20 -top-20 w-40 h-40 blur-[80px] opacity-30 rounded-full bg-rose-600 transition-all duration-700" />

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
                <div className="h-12 w-12 shrink-0 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.1)]">
                    <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                {/* Content */}
                <div className="flex-1 pr-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-500 mb-2">Inventory Alert</p>
                    <p className="text-[15px] font-light text-white/90 tracking-tight leading-snug italic mb-1">{title}</p>
                    <p className="text-[10px] text-white/40 font-medium uppercase tracking-[0.1em]">Currently Archived</p>
                </div>
            </div>
        </div>
    )
}

export default InventoryNotification
