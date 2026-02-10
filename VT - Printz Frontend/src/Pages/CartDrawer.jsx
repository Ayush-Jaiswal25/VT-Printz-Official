import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { WHATSAPP_NUMBER } from "../Utils/constants";

function CartDrawer({ onClose }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Cart
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart/get`, {
        headers: { "auth-token": token },
      });
      setCartItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    onClose();
    navigate("/login-and-signup");
  };

  const updateQty = async (id, type) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/update`,
        { productId: id, type },
        { headers: { "auth-token": token } }
      );
      setCartItems(res.data.cart);
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/remove`,
        { productId: id },
        { headers: { "auth-token": token } }
      );
      setCartItems(res.data.cart);
    } catch (err) {
      console.error(err);
    }
  };

  const isEmpty = cartItems.length === 0;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.productId?.discountedPrice || item.productId?.originalPrice || 0) * item.quantity,
    0
  );

  const discount = subtotal > 999 ? subtotal * 0.12 : 0;
  const finalTotal = subtotal - discount;

  const handleCheckout = async () => {
    // 1. Create Order in Backend (Seamless)
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login-and-signup");
        return;
      }

      setLoading(true);
      // This will clear the cart in backend
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders/create`, {}, {
        headers: { "auth-token": token }
      });

      // 2. Prepare WhatsApp Message
      let message = "Hello, I want to confirm my order:%0A%0A";
      // Use cartItems from state (which are now cleared in backend, but we still have them in local state to build message)
      // Or deeper, we could use the response order items, but using local state is faster for now.

      cartItems.forEach((item, index) => {
        const price = item.productId?.discountedPrice || item.productId?.originalPrice || 0;
        message += `${index + 1}. ${item.productId?.name} (x${item.quantity}) - ₹${price * item.quantity}%0A`;
        if (item.logoUrl) message += `   Design: ${item.logoUrl}%0A`;
        if (item.videoUrl) message += `   Video/Ref: ${item.videoUrl}%0A`;
        if (item.customizationNote) message += `   Note: ${item.customizationNote}%0A`;
      });

      message += `%0ASubtotal: ₹${subtotal}`;
      message += `%0ADiscount: -₹${discount.toFixed(0)}`;
      message += `%0A*Total Amount: ₹${finalTotal.toFixed(0)}*`;
      message += `%0AOrder ID: ${res.data.order._id}`;
      message += "%0A%0APlease process my order.";

      // Clear local cart
      setCartItems([]);

      // 3. Redirect to WhatsApp
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");

      // Close drawer and go to orders?
      onClose();
      navigate("/my-orders");

    } catch (err) {
      console.error("Order creation failed", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-[105]"
      />

      {/* CART DRAWER */}
      <div
        className="
          fixed right-0 top-0
          h-[100vh]
          w-[380px]
          bg-white
          z-[110]
          shadow-xl
          transition-transform duration-300
          translate-x-0
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">SHOPPING CART</h2>
            {/* Show User Name */}
            <p className="text-xs text-gray-500">Hi, {userName}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { onClose(); navigate("/my-orders"); }}
              className="text-xs font-bold text-[#02192F] border border-[#02192F] px-2 py-1 rounded hover:bg-gray-50 transition"
            >
              MY ORDERS
            </button>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-red-500 border border-red-500 px-2 py-1 rounded hover:bg-red-50 transition"
            >
              LOGOUT
            </button>
            <button onClick={onClose} className="text-xl">✕</button>
          </div>
        </div>

        {/* PROMO */}
        <div className="bg-red-600 text-white text-sm text-center py-2 font-medium">
          Your brand deserves this! Click Buy Now to Proceed
        </div>

        {/* CONTENT */}
        <div className="flex flex-col overflow-y-auto h-[calc(100vh-200px)]">
          {loading ? (
            <div className="flex items-center justify-center p-10">Loading cart...</div>
          ) : isEmpty ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 mt-10">
              <h3 className="text-lg font-semibold mb-1">
                Your cart is empty
              </h3>
              <button
                onClick={onClose}
                className="bg-[#DB2A7B] text-white px-6 py-2 rounded-lg mt-4"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-5 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition relative group"
                  onClick={() => {
                    const product = item.productId;
                    if (product?.serviceId?.categoryId?.slug && product?.serviceId?.slug && product?.slug) {
                      onClose();
                      navigate(`/services/${product.serviceId.categoryId.slug}/${product.serviceId.slug}/${product.slug}`);
                    } else if (product?.serviceId?.categoryId?.slug && product?.serviceId?.slug) {
                      // Fallback for services without sub-products (if applicable)
                      onClose();
                      navigate(`/services/${product.serviceId.categoryId.slug}/${product.serviceId.slug}`);
                    }
                  }}
                >
                  <img
                    src={item.productId?.image || "https://via.placeholder.com/80"}
                    alt={item.productId?.name}
                    className="w-20 h-20 rounded-lg border object-cover"
                  />

                  <div className="flex-1">
                    <h4 className="font-semibold text-sm line-clamp-2">{item.productId?.name}</h4>
                    <p className="text-xs text-gray-500">{item.productId?.category}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-red-600 font-semibold">
                        ₹ {item.productId?.discountedPrice || item.productId?.originalPrice || 0}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 mt-1">
                      {item.customizationNote && (
                        <p className="text-xs text-gray-500 italic bg-gray-50 p-1 rounded">
                          {item.customizationNote}
                        </p>
                      )}

                      {item.logoUrl && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">Design:</span>
                          <img
                            src={item.logoUrl}
                            alt="Custom Design"
                            className="w-10 h-10 object-cover rounded border border-gray-200"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex border rounded-full">
                        <button
                          onClick={() => updateQty(item.productId._id, "dec")}
                          className="px-3 hover:bg-gray-100 rounded-l-full"
                        >−</button>
                        <span className="px-4 text-sm flex items-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.productId._id, "inc")}
                          className="px-3 hover:bg-gray-100 rounded-r-full"
                        >+</button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {!isEmpty && (
          <div className="absolute bottom-0 left-0 w-full bg-white border-t p-5 space-y-3 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between text-sm text-red-600">
              <span>{subtotal > 999 ? "12% off applied" : "Add more for 12% off"}</span>
              <span>- ₹ {discount.toFixed(0)}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹ {finalTotal.toFixed(0)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] transition text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              Order on WhatsApp
              {/* WhatsApp Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
