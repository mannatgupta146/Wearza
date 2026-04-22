import React from "react"

const InventoryNotification = ({ closeToast, toastProps }) => {
    const { title } = toastProps.data

    return (
        <div className="relative p-5 w-full">
            {/* Topmost Right Close Button */}
            <button 
                onClick={closeToast}
                className="absolute top-2.5 right-2.5 p-1 text-white/30 hover:text-white transition-colors duration-300 z-50 group"
                aria-label="Close notification"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="flex items-center gap-5">
                {/* Icon Frame */}
                <div className="relative h-16 w-16 shrink-0 rounded-2xl bg-rose-500/10 border border-rose-500/20 overflow-hidden flex items-center justify-center">
                    <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center py-1">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                        <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.3em]">
                            Inventory Alert
                        </p>
                    </div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight line-clamp-1 mb-1">{title}</h4>
                    <p className="text-[10px] text-white/40 font-medium leading-relaxed">
                        This selection is currently out of stock.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default InventoryNotification
