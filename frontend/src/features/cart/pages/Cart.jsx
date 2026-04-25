import React, { useMemo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hooks/useCart'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useRazorpay } from "react-razorpay";

const Cart = () => {
    const { items: cart, totalPrice, currency } = useSelector(state => state.cart)
    const { handleGetCart, handleRemoveItem, handleUpdateItem, handleCreateCartOrder } = useCart()
    const [loading, setLoading] = useState(true)
    const user = useSelector(state => state.user)
    const { error, isLoading, Razorpay} = useRazorpay();

    useEffect(() => {
        const fetch = async () => {
            await handleGetCart()
            setLoading(false)
        }
        fetch()
    }, [])

    const handleCheckout = async () => {
        const order = await handleCreateCartOrder()
        console.log(order)

        const options= {
            key: "rzp_test_ShkLOA2ShVf1Fi",
            amount: order.amount, // Amount in paise
            currency: order.currency,
            name: "Wearza",
            description: "Payment for your order",
            order_id: order.id, 
            handler: (response) => {
                console.log(response);
                navigate("/")
            },
            prefill: {
                name: user?.fullname,
                email: user?.email,
                contact: "9999999999",
            },
            theme: {
                color: "#FF9E00",
            },
        };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
    }

    const getCurrentPricing = (item) => {
        const variants = item.product?.variants;
        const variantObj = Array.isArray(variants) 
            ? variants.find(v => v._id === item.variant) 
            : (variants?._id === item.variant ? variants : null);
        
        const currentPrice = (variantObj?.price || item.product?.price)?.amount || item.price.amount;
        const savedPrice = item.price.amount;
        const mrp = item.price?.mrp;
        const isPriceDropped = currentPrice < savedPrice;
        
        return { currentPrice, savedPrice, mrp, isPriceDropped };
    };


    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency || 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const getVariantLabel = (item) => {
        if (!item.variant || !item.product?.variants) return []
        
        // Handle both aggregated (single object) and raw (array) variants
        const variants = item.product.variants
        const v = Array.isArray(variants) 
            ? variants.find(v => v._id === item.variant)
            : (variants._id === item.variant ? variants : null)
            
        return v?.attributes ? Object.entries(v.attributes) : []
    }

    const getPriceAnalysis = (item) => {
        if (!item.product || !item.variant || !item.price) return null
        
        const variants = item.product.variants
        const currentVariant = Array.isArray(variants)
            ? variants.find(v => v._id === item.variant)
            : (variants._id === item.variant ? variants : null)
            
        const currentPrice = currentVariant?.price?.amount || item.product.price?.amount
        const savedPrice = item.price.amount

        if (!currentPrice || !savedPrice) return null

        if (currentPrice < savedPrice) {
            return {
                type: 'drop',
                message: `Price dropped by ${formatCurrency(savedPrice - currentPrice)}!`,
                color: 'text-emerald-400'
            }
        } else if (currentPrice > savedPrice) {
            return {
                type: 'increase',
                message: `Price increased by ${formatCurrency(currentPrice - savedPrice)}, Buy Fast!`,
                color: 'text-rose-500'
            }
        }
        return null
    }

    const getItemImage = (item) => {
        if (item.variant && item.product?.variants) {
            const variants = item.product.variants
            const variant = Array.isArray(variants)
                ? variants.find(v => v._id === item.variant)
                : (variants._id === item.variant ? variants : null)
                
            if (variant?.images?.length > 0) return variant.images[0].url
        }
        return item.product?.images?.[0]?.url
    }

    const incrementCartItem = (item) => {
        if (item.quantity < 10) {
            handleUpdateItem({ productId: item.product?._id, variantId: item.variant, quantity: item.quantity + 1 })
        } else {
            toast.warning("Maximum order quantity is 10 units", {
                toastId: `max-qty-${item._id}`,
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: true,
                theme: "dark",
                pauseOnHover: false,
            })
        }
    }

    const decrementCartItem = (item) => {
        if (item.quantity > 1) {
            handleUpdateItem({ productId: item.product?._id, variantId: item.variant, quantity: item.quantity - 1 })
        } else {
            toast.warning("Minimum order quantity is 1 unit", {
                toastId: `min-qty-${item._id}`,
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: true,
                theme: "dark",
                pauseOnHover: false,
            })
        }
    }

    if (loading) {
        return <div className="min-h-screen bg-black flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mb-4" />
            <p className="text-amber-400/60 uppercase tracking-[0.3em] text-[10px] font-black">Synchronizing Collection</p>
        </div>
    }

    if (!cart || cart.length === 0) {
        return (
            <div className="min-h-screen bg-black pt-32 px-6 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-amber-400/5 border border-amber-400/10 flex items-center justify-center mb-8">
                    <svg className="w-10 h-10 text-amber-400/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-extralight text-white tracking-[0.2em] uppercase mb-6">Empty Bag</h1>
                <p className="text-white/40 font-light max-w-sm mb-12 leading-relaxed tracking-wide">Your collection is currently empty. Curate your style with our latest pieces.</p>
                <Link 
                    to="/" 
                    className="px-10 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-[0_10px_30px_rgba(251,191,36,0.2)] hover:brightness-110 transition-all"
                >
                    Explore Shop
                </Link>
            </div>
        )
    }

    return (
        <div className="h-screen bg-black text-white pt-32 pb-10 px-6 sm:px-10 lg:px-16 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col h-full">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start h-full overflow-hidden">
                    
                    {/* Items Section - Independently Scrollable */}
                    <div className="flex-1 w-full min-w-0 h-full overflow-y-auto pr-6 custom-scrollbar">
                        <header className="mb-12">
                            <h1 className="text-4xl font-extralight tracking-[0.05em] uppercase mb-4">
                                Shopping <span className="text-amber-400">Bag</span>
                            </h1>
                            <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-4">
                                {cart.length} curated pieces <div className="h-[1px] flex-1 bg-white/10" />
                            </div>
                        </header>

                        <div className="space-y-16">
                            {cart.map((item) => (
                                 <div key={item._id} className="group relative flex flex-col lg:flex-row gap-12 pb-16 border-b border-white/[0.05] transition-all duration-700">
                                    {/* Image Section */}
                                    <div className="group/img h-80 w-full lg:w-64 shrink-0 bg-[#09090a] rounded-[2.5rem] overflow-hidden relative border border-white/[0.05] hover:border-amber-400/20 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                                        <img 
                                            src={getItemImage(item)} 
                                            alt={item.product?.title}
                                            className="h-full w-full object-contain opacity-90 group-hover/img:opacity-100 transition-all duration-700 group-hover/img:scale-110 p-6"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col py-2">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-light tracking-tight text-white group-hover:text-amber-400 transition-colors duration-500">{item.product?.title}</h3>
                                                {getVariantLabel(item).length > 0 && (
                                                    <div className="flex flex-wrap gap-4 items-center">
                                                        {getVariantLabel(item).map(([key, value]) => (
                                                            <div key={key} className="flex items-center gap-2">
                                                                <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">{key} :</span>
                                                                <div className="inline-flex items-center px-3 py-1 rounded-lg border border-amber-400/20 bg-amber-400/5 text-[9px] uppercase tracking-widest font-black text-amber-400">
                                                                    {value}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <button 
                                                onClick={() => handleRemoveItem({ productId: item.product?._id, variantId: item.variant })}
                                                className="p-2 text-white/20 hover:text-rose-500 transition-all bg-white/[0.03] hover:bg-rose-500/10 rounded-full"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>

                                        <p className="text-xs text-white/30 font-light line-clamp-2 leading-relaxed mb-8 max-w-xl">
                                            {item.product?.description}
                                        </p>

                                         <div className="mt-auto grid grid-cols-1 xl:grid-cols-[1fr_auto] items-end gap-12">
                                             <div className="space-y-8">
                                                  {/* Price Display */}
                                                  <div className="space-y-4">
                                                       <div className="flex flex-col gap-1.5">
                                                           {(() => {
                                                               const { currentPrice, savedPrice, mrp } = getCurrentPricing(item);
                                                               const analysis = getPriceAnalysis(item);

                                                               return (
                                                                   <>
                                                                       <div className="flex items-baseline gap-3">
                                                                           <span className="text-5xl font-extralight tracking-tighter text-white transition-all duration-700">
                                                                               {formatCurrency(currentPrice)}
                                                                           </span>
                                                                           {analysis?.type === 'drop' && (
                                                                               <span className="text-base text-white/30 line-through font-normal decoration-white/60">
                                                                                   {formatCurrency(savedPrice)}
                                                                               </span>
                                                                           )}
                                                                           {analysis?.type === 'increase' && (
                                                                               <span className="text-xs text-white/20 font-light">
                                                                                   from {formatCurrency(savedPrice)}
                                                                               </span>
                                                                           )}
                                                                       </div>
                                                                       {analysis && (
                                                                           <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit animate-pulse border transition-all duration-700 ${
                                                                               analysis.type === 'drop' 
                                                                                   ? 'bg-emerald-400/5 border-emerald-400/20' 
                                                                                   : 'bg-rose-500/10 border-rose-500/20'
                                                                           }`}>
                                                                               <div className={`w-1.5 h-1.5 rounded-full ${
                                                                                   analysis.type === 'drop' ? 'bg-emerald-400' : 'bg-rose-500'
                                                                               }`} />
                                                                               <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                                                                                   analysis.type === 'drop' ? 'text-emerald-400' : 'text-rose-500'
                                                                               }`}>
                                                                                   {analysis.message}
                                                                               </span>
                                                                           </div>
                                                                       )}
                                                                       {!analysis && mrp && mrp > currentPrice && (
                                                                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400/60">
                                                                               {Math.round(((mrp - currentPrice) / mrp) * 100)}% Special Offer
                                                                           </span>
                                                                       )}
                                                                   </>
                                                               );
                                                           })()}
                                                       </div>
                                                  </div>

                                                 {/* Quantity Control */}
                                                 <div className="flex items-center bg-white/[0.03] border border-white/[0.05] rounded-2xl p-1 w-fit group/qty hover:border-amber-400/20 transition-all duration-500 shadow-inner">
                                                     <button 
                                                         onClick={() => decrementCartItem(item)}
                                                         className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${item.quantity <= 1 ? "opacity-10 cursor-not-allowed" : "text-white/40 hover:text-white hover:bg-white/10 active:scale-95"}`}
                                                     >
                                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4"/></svg>
                                                     </button>
                                                     <span className="w-14 text-center text-base font-black tabular-nums text-white/90">{item.quantity}</span>
                                                     <button 
                                                         onClick={() => incrementCartItem(item)}
                                                         className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${item.quantity >= 10 ? "opacity-10 cursor-not-allowed" : "text-white/40 hover:text-white hover:bg-white/10 active:scale-95"}`}
                                                     >
                                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
                                                     </button>
                                                 </div>
                                             </div>

                                             {/* Item Total - Integrated Sidebar */}
                                             <div className="flex flex-col items-end gap-3 bg-gradient-to-br from-white/[0.03] to-transparent p-8 rounded-[2.5rem] min-w-[200px] transition-all duration-700 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                                                 <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-black">Bag Total</p>
                                                 <div className="flex flex-col items-end gap-1">
                                                     <p className="text-4xl font-extralight tracking-tighter text-amber-400/90">
                                                         {(() => {
                                                             const { currentPrice } = getCurrentPricing(item);
                                                             return formatCurrency(currentPrice * item.quantity);
                                                         })()}
                                                     </p>
                                                     {(() => {
                                                         const { currentPrice, savedPrice, mrp } = getCurrentPricing(item);
                                                         const effectiveOriginal = (currentPrice < savedPrice) ? savedPrice : mrp;
                                                         
                                                         if (effectiveOriginal && effectiveOriginal > currentPrice) {
                                                             return (
                                                                <span className="text-[9px] font-black text-emerald-400/60 uppercase tracking-[0.2em]">
                                                                    Saving {formatCurrency((effectiveOriginal - currentPrice) * item.quantity)}
                                                                </span>
                                                             );
                                                         }
                                                         return null;
                                                     })()}
                                                 </div>
                                             </div>
                                         </div>
                                    </div>
                                 </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="w-full lg:w-[350px] shrink-0 h-full lg:sticky lg:top-32">
                        <div className="h-full">
                            <div className="bg-[#050505] border border-white/[0.08] rounded-xl p-5 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col group/summary hover:border-amber-400/20 transition-all duration-700 h-full">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl group-hover/summary:bg-amber-400/10 transition-all duration-700" />
                                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover/summary:bg-orange-500/10 transition-all duration-700" />
                                
                                <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-white/50 mb-8 pb-4 border-b border-white/[0.08] flex justify-between items-center">
                                    <span>Order Summary</span>
                                    <div className="flex items-center gap-1.5 bg-amber-400/10 px-2 py-1 rounded-full border border-amber-400/20">
                                        <span className="text-[7px] text-amber-400/80 tracking-widest font-black uppercase">Active</span>
                                        <div className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                                    </div>
                                </h2>
                                
                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-center group/item px-2">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">Subtotal</span>
                                            <span className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-medium">Items Total</span>
                                        </div>
                                        <span className="text-[14px] font-light tracking-[0.15em] text-white/90">{formatCurrency(totalPrice)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center group/item px-2">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">Shipping</span>
                                            <span className="text-[8px] text-emerald-400/60 uppercase tracking-[0.2em] font-black">Standard Delivery</span>
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 border-b border-emerald-400/30 pb-0.5">Complimentary</span>
                                    </div>

                                    <div className="pt-8 border-t border-white/[0.08] flex flex-col items-center">
                                        <div className="mb-4 flex flex-col items-center">
                                            <div className="h-[1px] w-8 bg-amber-400/30 mb-3" />
                                            <span className="text-[9px] uppercase tracking-[0.5em] font-black text-amber-400/80">Total Amount</span>
                                        </div>
                                        <div className="relative group/price py-2">
                                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-24 w-full bg-amber-400/[0.05] blur-[60px] rounded-full opacity-100 group-hover:bg-amber-400/[0.08] transition-all duration-1000" />
                                            <span className="text-5xl font-extralight tracking-[-0.07em] text-white relative z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                                {formatCurrency(totalPrice)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4 px-2">
                                    <button onClick={handleCheckout}
                                    className="group/btn relative w-full bg-gradient-to-r from-amber-400 to-orange-500 text-black py-4.5 text-[10px] font-bold uppercase tracking-[0.5em] rounded-sm overflow-hidden shadow-[0_15px_50px_rgba(251,191,36,0.2)] transition-all duration-700 hover:shadow-[0_25px_80px_rgba(251,191,36,0.35)] hover:-translate-y-1.5">
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-[45deg] -translate-x-[250%] group-hover/btn:translate-x-[250%] transition-transform duration-[1200ms] ease-in-out" />
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Proceed to Checkout
                                            <svg className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                        </span>
                                    </button>
                                    
                                    <Link 
                                        to="/" 
                                        className="block w-full text-center border border-white/[0.12] bg-white/[0.02] text-white/50 py-4 text-[9px] font-black uppercase tracking-[0.5em] rounded-sm hover:bg-white/[0.06] hover:text-white hover:border-white/30 transition-all duration-700"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                                
                                <div className="mt-auto pt-8">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center justify-between px-5 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-2xl group/security hover:border-emerald-400/30 transition-all duration-700">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-md animate-pulse" />
                                                    <svg className="w-4 h-4 text-emerald-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                    </svg>
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/60 group-hover/security:text-emerald-400 transition-colors duration-700">Secure Checkout</span>
                                                    <span className="text-[6px] uppercase tracking-[0.2em] text-white/30 font-bold">Encrypted Session</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1.5 opacity-30 group-hover/security:opacity-50 transition-opacity">
                                                <div className="w-1 h-1 rounded-full bg-white" />
                                                <div className="w-1 h-1 rounded-full bg-white" />
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-center gap-5 opacity-30 group/razor hover:opacity-50 transition-all duration-700">
                                            <span className="text-[7px] font-black uppercase tracking-[0.5em] text-white/80">Powered by</span>
                                            <div className="flex items-center gap-2.5 grayscale group-hover/razor:grayscale-0 transition-all">
                                                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white">Razorpay</span>
                                                <div className="w-1 h-1 rounded-full bg-[#3395FF] animate-pulse shadow-[0_0_10px_rgba(51,149,255,0.6)]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart