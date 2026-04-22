import React, { useMemo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hooks/useCart'
import { Link } from 'react-router-dom'

const Cart = () => {
    const cartItems = useSelector(state => state.cart.items)
    const { handleGetCart, handleRemoveItem, handleUpdateItem } = useCart()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            await handleGetCart()
            setLoading(false)
        }
        fetch()
    }, [])

    const subtotal = useMemo(() => {
        if (!cartItems) return 0
        return cartItems.reduce((acc, item) => ((item.price?.amount || 0) * item.quantity) + acc, 0)
    }, [cartItems])

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const getVariantLabel = (item) => {
        if (!item.variant || !item.product?.variants) return null
        const v = item.product.variants.find(v => v._id === item.variant)
        return v?.attributes ? Object.values(v.attributes).join(' / ') : null
    }

    const getItemImage = (item) => {
        if (item.variant && item.product?.variants) {
            const variant = item.product.variants.find(v => v._id === item.variant)
            if (variant?.images?.length > 0) return variant.images[0].url
        }
        return item.product?.images?.[0]?.url
    }

    if (loading) {
        return <div className="min-h-screen bg-black flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mb-4" />
            <p className="text-amber-400/60 uppercase tracking-[0.3em] text-[10px] font-black">Synchronizing Collection</p>
        </div>
    }

    if (!cartItems || cartItems.length === 0) {
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
        <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 sm:px-10 lg:px-16">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                    
                    {/* Items Section */}
                    <div className="flex-1">
                        <header className="mb-12">
                            <h1 className="text-4xl font-extralight tracking-[0.05em] uppercase mb-4">
                                Shopping <span className="text-amber-400">Bag</span>
                            </h1>
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-4">
                                {cartItems.length} curated pieces <div className="h-[1px] flex-1 bg-white/10" />
                            </p>
                        </header>

                        <div className="space-y-16">
                            {cartItems.map((item) => (
                                <div key={item._id} className="group relative flex flex-col sm:flex-row gap-10 pb-16 border-b border-white/[0.05]">
                                    {/* Image Section */}
                                    <div className="h-72 w-full sm:w-56 shrink-0 bg-neutral-900 rounded-3xl overflow-hidden relative border border-white/[0.05] group-hover:border-amber-400/30 transition-colors duration-500">
                                        <img 
                                            src={getItemImage(item)} 
                                            alt={item.product?.title}
                                            className="h-full w-full object-contain opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105 p-4"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col py-2">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-2xl font-light tracking-wide mb-2 uppercase group-hover:text-amber-400 transition-colors">{item.product?.title}</h3>
                                                {getVariantLabel(item) && (
                                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[9px] text-amber-400 uppercase tracking-widest font-black">
                                                        {getVariantLabel(item)}
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

                                        <p className="text-xs text-white/50 font-light line-clamp-3 leading-relaxed mb-8 max-w-xl">
                                            {item.product?.description}
                                        </p>

                                        <div className="mt-auto flex flex-wrap items-end justify-between gap-8">
                                            <div className="space-y-6">
                                                {/* Price Display */}
                                                <div className="flex items-baseline gap-4">
                                                        <span className="text-3xl font-light tracking-tighter text-white">
                                                            {formatCurrency(item.price?.amount || 0)}
                                                        </span>
                                                        <span className="text-sm text-white/30 line-through font-light">
                                                            {formatCurrency((item.price?.amount || 0) * 1.5)}
                                                        </span>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400/80">
                                                            33% OFF
                                                        </span>
                                                    </div>

                                                    {/* Quantity Control */}
                                                    <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-2xl p-1.5 w-fit">
                                                        <button 
                                                            onClick={() => item.quantity > 1 && handleUpdateItem({ productId: item.product?._id, variantId: item.variant, quantity: item.quantity - 1 })}
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-white/30 hover:text-white transition-all disabled:opacity-10"
                                                            disabled={item.quantity <= 1}
                                                        >—</button>
                                                        <span className="w-10 text-center text-sm font-black tabular-nums">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => handleUpdateItem({ productId: item.product?._id, variantId: item.variant, quantity: item.quantity + 1 })}
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-white/30 hover:text-white transition-all"
                                                        >+</button>
                                                    </div>
                                                </div>

                                                {/* Total for this item */}
                                                <div className="text-right p-4 rounded-3xl bg-amber-400/[0.02] border border-amber-400/5">
                                                    <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-black mb-2">Item Total</p>
                                                    <p className="text-3xl font-light tracking-tighter text-amber-400">
                                                        {formatCurrency((item.price?.amount || 0) * item.quantity)}
                                                    </p>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="lg:w-[400px] shrink-0">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl" />
                                
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-10 pb-4 border-b border-white/10">Order Summary</h2>
                                
                                <div className="space-y-6 mb-12">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/40 font-light uppercase tracking-widest">Subtotal</span>
                                        <span className="font-light">{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/40 font-light uppercase tracking-widest">Shipping</span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Complimentary</span>
                                    </div>
                                    <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                                        <div>
                                            <span className="text-[9px] uppercase tracking-[0.3em] font-black text-amber-400 block mb-2">Est. Total</span>
                                            <span className="text-4xl font-light tracking-tighter text-white">
                                                {formatCurrency(subtotal)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-black py-5 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm shadow-lg hover:brightness-105 hover:-translate-y-0.5 transition-all active:scale-[0.98]">
                                        Proceed to Checkout
                                    </button>
                                    
                                    <Link 
                                        to="/" 
                                        className="block w-full text-center border border-white/10 bg-white/5 text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-white/10 transition-all active:scale-[0.98]"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <div className="w-full bg-amber-400/[0.02] border border-amber-400/10 rounded-2xl p-5">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-amber-400">Guaranteed Safe Checkout</p>
                                                <p className="text-[7px] text-white/30 uppercase tracking-[0.2em]">PCI-DSS Certified • 256-Bit SSL</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center opacity-20 text-[6px] font-black tracking-[0.3em] uppercase">
                                            <span>Visa</span>
                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                            <span>Mastercard</span>
                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                            <span>PayPal</span>
                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                            <span>Amex</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 py-5 bg-amber-400/[0.03] border border-amber-400/10 rounded-3xl flex items-center justify-between">
                                <span className="text-[9px] uppercase tracking-[0.3em] text-amber-400/60 font-black">Premium Support 24/7</span>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Cart