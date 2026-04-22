import React from "react"

const CartNotification = ({ closeToast, toastProps }) => {
    const { title, image, quantity, navigate } = toastProps.data

    return (
        <div className="relative p-5 w-full">
            {/* Topmost Right Close Button */}
            <button 
                onClick={closeToast}
                className="absolute top-1 right-2 p-1.5 text-white/30 hover:text-white transition-colors duration-300 z-50 group"
                aria-label="Close notification"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="flex items-center gap-5">
                {/* Image Frame */}
                <div className="relative h-20 w-20 shrink-0 rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden shadow-inner flex items-center justify-center">
                    <img src={image} alt={title} className="h-full w-full object-contain p-2 scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between py-0.5 min-h-[80px]">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <p className="text-[8px] font-black text-emerald-500/80 uppercase tracking-[0.4em]">
                                Added to Bag
                            </p>
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-tight line-clamp-1 mb-0.5">{title}</h4>
                        <p className="text-[9px] text-amber-400 font-black uppercase tracking-[0.2em] opacity-90">
                            {quantity} {quantity > 1 ? "Pieces" : "Piece"}
                        </p>
                    </div>

                    <button 
                        onClick={() => {
                            navigate("/cart")
                            closeToast()
                        }}
                        className="w-full mt-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-[0.98]"
                    >
                        View Bag
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CartNotification
