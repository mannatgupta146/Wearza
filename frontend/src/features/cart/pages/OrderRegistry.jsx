import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const OrderRegistry = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [copyId, setCopyId] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('/api/cart/orders')
                if (data.success) {
                    setOrders(data.orders)
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    const handleCopy = (id) => {
        navigator.clipboard.writeText(id)
        setCopyId(id)
        setTimeout(() => setCopyId(null), 2000)
    }

    const totalInvestment = orders.reduce((acc, order) => acc + order.price.amount, 0)

    return (
        <div className="min-h-screen bg-[#060607] text-white pt-32 pb-32 px-6 selection:bg-amber-500/30">
            {/* Atmospheric Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1a1a1a,transparent)] opacity-40" />
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-amber-500/5 blur-[160px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Refined Hero Header */}
                <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <p className="text-[9px] font-black uppercase tracking-[0.8em] text-amber-500/50 mb-4">
                            Your Purchases
                        </p>
                        <h1 className="text-5xl md:text-7xl font-extralight tracking-[-0.05em] leading-none mb-2">
                            Order <span className="italic font-serif text-amber-400">History</span>
                        </h1>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="flex flex-wrap gap-12 md:pb-2"
                    >
                        <div className="flex flex-col gap-2">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Total Orders</p>
                            <p className="text-3xl md:text-4xl font-extralight tracking-tighter tabular-nums">
                                {orders.length}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Total Spent</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">INR</span>
                                <p className="text-3xl md:text-4xl font-extralight tracking-tighter tabular-nums">
                                    {totalInvestment.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <div className="w-12 h-px bg-amber-500/20 relative overflow-hidden">
                            <motion.div 
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="absolute inset-0 bg-amber-400"
                            />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Loading Orders</p>
                    </div>
                ) : orders.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-40 group"
                    >
                        <h2 className="text-2xl font-light text-white/40 mb-8 tracking-tight italic">No orders found in your history.</h2>
                        <Link to="/" className="inline-flex items-center gap-4 text-amber-400 text-[10px] font-black uppercase tracking-[0.5em] group-hover:gap-8 transition-all duration-700">
                            Start Shopping <span className="text-xl">→</span>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-40">
                        {orders.map((order, index) => (
                            <motion.section
                                key={order._id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative"
                            >
                                {/* Year/Date Anchor */}
                                <div className="lg:col-span-3 flex flex-col border-l border-amber-500/20 pl-8 pt-2">
                                    <span className="text-sm font-serif italic text-amber-400/60 mb-2">
                                        {new Date(order.paymentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                    </span>
                                    <span className="text-6xl font-extralight tracking-tighter opacity-10">
                                        {new Date(order.paymentDate).getFullYear()}
                                    </span>
                                    
                                    <div className="mt-auto pt-12">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400/60">Success</span>
                                        </div>
                                        <p className="text-[10px] font-mono text-white/20 tracking-widest break-all hover:text-white/40 transition-colors cursor-help">
                                            ID: {order.razorpay.orderId}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Content */}
                                <div className="lg:col-span-9">
                                    <div className="grid grid-cols-1 gap-12 mb-16">
                                        {order.orderItems.map((item, idx) => (
                                            <motion.div 
                                                key={idx}
                                                whileHover={{ x: 10 }}
                                                onClick={() => navigate(`/product/${item.productId}`)}
                                                className="group cursor-pointer relative bg-white/[0.01] border-b border-white/5 pb-12 transition-all duration-700"
                                            >
                                                <div className="flex flex-col md:flex-row gap-12 items-center">
                                                    <div className="w-full md:w-52 h-72 bg-white/[0.03] rounded-[2rem] overflow-hidden p-2 border border-white/5 relative group-hover:border-amber-400/20 transition-colors">
                                                        <img 
                                                            src={item.images?.[0]?.url || item.images?.[0]} 
                                                            alt={item.title}
                                                            className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                                                        />
                                                    </div>
                                                    <div className="flex-1 text-center md:text-left">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/60 mb-3 italic">Item {idx + 1}</p>
                                                        <h4 className="text-2xl md:text-3xl font-light text-white tracking-tighter leading-tight mb-6 group-hover:text-amber-400 transition-colors">{item.title}</h4>
                                                        <div className="flex flex-wrap justify-center md:justify-start gap-8 items-center">
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Quantity</span>
                                                                <span className="text-lg font-light">{item.quantity}</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Price</span>
                                                                <span className="text-lg font-light">{item.price.currency} {item.price.amount.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Simplified Order Footer */}
                                    <div className="flex items-center justify-between border-t border-white/5 pt-8">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">Order Total</p>
                                            <p className="text-3xl font-light text-amber-400 tracking-tighter">
                                                {order.price.currency} {order.price.amount.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderRegistry
