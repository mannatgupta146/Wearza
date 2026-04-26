import React from "react"

const CartNotification = ({ closeToast, toastProps }) => {
    const { title, image, quantity, navigate } = toastProps.data

    return (
        <div className="relative p-8 w-full min-w-[380px] overflow-hidden group">
            {/* Atmospheric Background Glow */}
            <div className="absolute -right-20 -top-20 w-40 h-40 blur-[80px] opacity-30 rounded-full bg-amber-500 transition-all duration-700" />

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

            <div className="flex items-center gap-8 relative z-10">
                {/* Product Frame - Spotlight Effect */}
                <div className="relative h-24 w-24 shrink-0 rounded-[1.5rem] bg-black/60 border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-white/5 opacity-40" />
                    <img src={image} alt={title} className="h-full w-full object-contain p-3 transition-transform duration-700 group-hover:scale-110 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="mb-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-400 mb-2">Acquisition Added</p>
                        <p className="text-lg font-light text-white tracking-tight leading-tight line-clamp-1 italic">{title}</p>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">Quantity: {quantity}</p>
                    </div>

                    <button 
                        onClick={() => {
                            navigate("/cart")
                            closeToast()
                        }}
                        className="flex h-10 px-6 items-center justify-center rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-400 transition-all duration-500 shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
                    >
                        Review Bag
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CartNotification
