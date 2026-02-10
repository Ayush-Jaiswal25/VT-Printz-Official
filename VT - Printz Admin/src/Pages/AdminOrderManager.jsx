import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, RefreshCw } from "lucide-react";

function AdminOrderManager() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/all-orders`);
            setOrders(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/update-status/${id}`, {
                status: newStatus
            });
            // Update local state
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    const deleteOrder = async (id) => {
        if (!window.confirm("Are you sure you want to PERMANENTLY delete this order?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/orders/delete/${id}`);
            setOrders(prev => prev.filter(o => o._id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete order");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "bg-purple-100 text-purple-800";
            case "Confirmed": return "bg-blue-100 text-blue-800";
            case "Preparing": return "bg-yellow-100 text-yellow-800";
            case "Completed": return "bg-green-100 text-green-800";
            case "Cancelled": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">Order Management</h2>
                <button
                    onClick={fetchOrders}
                    className="p-2 hover:bg-gray-200 rounded-full transition"
                    title="Refresh Orders"
                >
                    <RefreshCw size={20} className={loading ? "animate-spin text-gray-500" : "text-gray-600"} />
                </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
                {loading && orders.length === 0 ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="animate-spin text-[#DB2A7B]" size={32} />
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order) => (
                            <div key={order._id} className="border rounded-xl p-5 hover:shadow-md transition bg-white">
                                <div className="flex flex-wrap justify-between gap-4 mb-4 border-b pb-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Order ID</p>
                                        <p className="text-sm font-mono text-gray-800">{order._id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">User</p>
                                        <p className="text-sm text-gray-800">{order.userId?.name || "Unknown"}</p>
                                        <p className="text-xs text-gray-500">{order.userId?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Amount</p>
                                        <p className="text-lg font-bold text-gray-900">₹{order.totalAmount}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            disabled={updatingId === order._id}
                                            className={`text-sm font-semibold px-3 py-1 rounded-lg border-0 cursor-pointer outline-none focus:ring-2 focus:ring-opacity-50 ${getStatusColor(order.status)}`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Preparing">Preparing</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                        {updatingId === order._id && <span className="ml-2 text-xs text-gray-500">Updating...</span>}
                                        <button
                                            onClick={() => deleteOrder(order._id)}
                                            className="ml-2 text-red-500 hover:text-red-700 bg-red-50 p-1 rounded"
                                            title="Delete Order"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-gray-500 uppercase">Items</p>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-center bg-gray-50 p-2 rounded-lg">
                                            <img
                                                src={item.productId?.image || item.logoUrl || "https://via.placeholder.com/40"}
                                                alt="Img"
                                                className="w-12 h-12 object-cover rounded border"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate">{item.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity} | ₹{item.price}</p>
                                                {item.customizationNote && <p className="text-xs text-gray-600 italic">Note: {item.customizationNote}</p>}
                                            </div>
                                            <div className="flex flex-col gap-1 text-right">
                                                {item.logoUrl && (
                                                    <div className="flex flex-col gap-1">
                                                        <a href={item.logoUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">
                                                            Design
                                                        </a>
                                                        <img src={item.logoUrl} alt="Design" className="w-8 h-8 object-cover rounded border border-blue-200" />
                                                    </div>
                                                )}
                                                {item.videoUrl && <a href={item.videoUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">Video</a>}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 text-xs text-gray-400 text-right">
                                    Placed on: {new Date(order.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))}
                        {orders.length === 0 && (
                            <div className="text-center text-gray-500 py-10">No orders found.</div>
                        )}
                    </div>
                )}
            </div>
        </div >
    );
}

export default AdminOrderManager;
