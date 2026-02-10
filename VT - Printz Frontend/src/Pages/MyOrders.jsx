import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MyOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/my-orders`, {
                headers: { "auth-token": token },
            });
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id, e) => {
        e.stopPropagation(); // Prevent navigation when clicking cancel
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/cancel/${id}`, {}, {
                headers: { "auth-token": token }
            });
            // Update local state
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status: "Cancelled" } : o));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to cancel order");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "text-purple-600 bg-purple-50 border-purple-200";
            case "Confirmed": return "text-blue-600 bg-blue-50 border-blue-200";
            case "Preparing": return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "Completed": return "text-green-600 bg-green-50 border-green-200";
            case "Cancelled": return "text-red-600 bg-red-50 border-red-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-10 flex justify-center">
                <Loader2 className="animate-spin text-[#DB2A7B]" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-10 px-4 text-center">
                <h2 className="text-2xl font-bold mb-4">My Orders</h2>
                <p className="text-gray-500">You haven't placed any orders yet.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-10 px-4 md:px-10 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-[#02192F]">My Orders</h1>

                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                            {/* ORDER HEADER */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Order Placed</p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
                                    <p className="text-sm font-semibold text-gray-800">₹{order.totalAmount}</p>
                                </div>
                                <div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        {order.status !== "Completed" && order.status !== "Cancelled" && (
                                            <button
                                                onClick={(e) => handleCancel(order._id, e)}
                                                className="ml-3 text-xs text-red-600 hover:text-red-800 underline font-semibold"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ORDER ITEMS */}
                            <div className="p-6 space-y-4">
                                {order.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4 items-start cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                                        onClick={() => {
                                            const product = item.productId;
                                            if (product?.serviceId?.categoryId?.slug && product?.serviceId?.slug && product?.slug) {
                                                navigate(`/services/${product.serviceId.categoryId.slug}/${product.serviceId.slug}/${product.slug}`);
                                            } else if (product?.serviceId?.categoryId?.slug && product?.serviceId?.slug) {
                                                // Fallback
                                                navigate(`/services/${product.serviceId.categoryId.slug}/${product.serviceId.slug}`);
                                            }
                                        }}
                                    >
                                        <img
                                            src={item.productId?.image || item.logoUrl || "https://via.placeholder.com/80?text=No+Image"}
                                            alt="Product"
                                            className="w-16 h-16 object-cover rounded-md border"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{item.name || "Custom Product"}</h4>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            {item.customizationNote && (
                                                <p className="text-xs text-gray-400 mt-1">Note: {item.customizationNote}</p>
                                            )}

                                            {/* FILES LINKS */}
                                            <div className="flex gap-3 mt-2" onClick={(e) => e.stopPropagation()}>
                                                {item.logoUrl && (
                                                    <div className="flex flex-col gap-1">
                                                        <a href={item.logoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                                            View Design
                                                        </a>
                                                        <img src={item.logoUrl} alt="Design" className="w-10 h-10 object-cover rounded border border-blue-200" />
                                                    </div>
                                                )}
                                                {item.videoUrl && (
                                                    <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                                        View Video
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-800">₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyOrders;
