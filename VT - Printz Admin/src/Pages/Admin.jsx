import React from "react";
import axios from "axios";
import {
  PlusSquare,
  MessageSquare,
  UserCog,
  Search,
  Trash2,
  Pencil,
  Package
} from "lucide-react";

// REAL feedback component (backend connected)
import AdminFeedbackList from "./AdminFeedbackList";
import ProductManager from "./ProductManager";
import AdminOrderManager from "./AdminOrderManager";
import Navbar from "../Components/Navbar";

function Admin() {
  const [active, setActive] = React.useState("orders"); // Default to orders

  // ---------------- SERVICE PROVIDER STATES ----------------
  const [providerQuery, setProviderQuery] = React.useState("");
  const [providerLoading, setProviderLoading] = React.useState(false);
  const [providerError, setProviderError] = React.useState("");
  const [products, setProducts] = React.useState([]);

  // ---------------- PRODUCTS (OPTIONAL) ----------------
  const fetchProducts = async () => {
    setProviderLoading(true);
    setProviderError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products?search=${encodeURIComponent(
          providerQuery
        )}`
      );
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch {
      setProviderError("Failed to load products");
    } finally {
      setProviderLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Navbar onNavigate={setActive} activeTab={active} />

      {/* Centered Content Wrapper */}
      <div className="mx-auto w-full max-w-7xl flex flex-1 h-full pt-28 pb-6 px-4 gap-6 overflow-hidden">

        {/* ---------------- SIDEBAR ---------------- */}
        <aside className="hidden lg:block w-1/4 h-full flex-shrink-0 pb-20">
          <div className="h-full rounded-xl border bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="px-4 py-4 text-lg font-semibold flex-shrink-0">Admin</div>
            <nav className="border-t overflow-y-auto flex-1">
              <button
                onClick={() => setActive("orders")}
                className={`flex w-full items-center gap-3 px-4 py-3 ${active === "orders"
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
                  }`}
              >
                <div className="w-[18px] h-[18px] flex items-center justify-center border border-current rounded text-[10px] font-bold">O</div> Orders
              </button>

              <button
                onClick={() => setActive("productmanager")}
                className={`flex w-full items-center gap-3 px-4 py-3 ${active === "productmanager"
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
                  }`}
              >
                <Package size={18} /> Manage Products
              </button>

              <button
                onClick={() => setActive("feedback")}
                className={`flex w-full items-center gap-3 px-4 py-3 ${active === "feedback"
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
                  }`}
              >
                <MessageSquare size={18} /> Feedback
              </button>
            </nav>
          </div>
        </aside>

        {/* ---------------- MAIN ---------------- */}
        <main className="flex-1 h-full overflow-y-auto no-scrollbar rounded-xl pb-20">
          {active === "serviceprovider" && (
            <div className="rounded-xl border bg-white p-5 shadow-sm min-h-full">
              <h2 className="font-semibold mb-4">Service Provider</h2>
              <p className="text-sm text-gray-600">
                This section can be used for managing other admin settings or provider details.
              </p>
            </div>
          )}

          {/* 🔥 NEW PRODUCT MANAGER */}
          {active === "productmanager" && <ProductManager />}

          {/* 🔥 NEW ORDER MANAGER */}
          {active === "orders" && <AdminOrderManager />}

          {/* 🔥 REAL FEEDBACK SYSTEM */}
          {active === "feedback" && <AdminFeedbackList />}
        </main>
      </div>
    </div>
  );
}

export default Admin;
