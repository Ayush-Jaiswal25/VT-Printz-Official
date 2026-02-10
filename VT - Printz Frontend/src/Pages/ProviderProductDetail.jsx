import React from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { MyContext } from "../ContextAPI.jsx";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const shapeOptions = ["Logo Cutout", "Circle", "Square"];
const packOptions = [10, 20, 50, 100, "3 Pieces Sample"];

function ProviderProductDetail() {
  const { addToCart, shareCartOnWhatsApp, fetchCartCount } = React.useContext(MyContext) || {};
  const location = useLocation();
  const [params] = useSearchParams();

  console.log("Location State:", location.state);
  const stateItem = location.state?.item;
  const queryItem = {
    name: params.get("name"),
    category: params.get("category"),
    price: params.get("price"),
    media: params.get("media"),
  };
  const baseItem = stateItem || queryItem;
  const name = baseItem?.name || "Customized Magnetic Badge";
  const category = baseItem?.category || "Magnetic Badge";
  const basePrice = parseFloat(baseItem?.price) || 1699;
  const media = baseItem?.media || undefined;
  const oldPrice = Math.round(basePrice * 1.23);

  const [shape, setShape] = React.useState(shapeOptions[0]);
  const [pack, setPack] = React.useState(10);
  const [uploadFile, setUploadFile] = React.useState(null);
  const fileRef = React.useRef(null);
  const [previewUrl, setPreviewUrl] = React.useState(null);

  React.useEffect(() => {
    if (!uploadFile) {
      setPreviewUrl(null);
      return;
    }
    // Only create object URL for images for preview on the mock
    if (uploadFile.type.startsWith('image/')) {
      const u = URL.createObjectURL(uploadFile);
      setPreviewUrl(u);
      return () => URL.revokeObjectURL(u);
    } else {
      setPreviewUrl(null);
    }
  }, [uploadFile]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setUploadFile(null);
      return;
    }
    // Size limit: 50MB
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size exceeds 50MB limit.");
      return;
    }
    setUploadFile(file);
  };

  const qty = typeof pack === "number" ? pack : 3;
  const total = basePrice * qty;

  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const onAddToCart = async () => {
    const token = localStorage.getItem("token");
    const productId = baseItem?._id;

    if (!productId) {
      alert("Product ID not found. Please navigate from the product list.");
      return;
    }

    if (!token) {
      // Save pending item to localStorage (cannot save files easily to localstorage)
      alert("Please login to add items to cart. Custom files (logo/video) must be re-selected after login.");
      // const pendingItem = { type: 'provider', productId, quantity: qty };
      // localStorage.setItem('pendingCartItem', JSON.stringify(pendingItem));
      // navigating to login
      navigate("/login-and-signup");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("quantity", qty);
      formData.append("customizationNote", `Shape: ${shape}`); // Example of sending other details

      if (uploadFile) {
        formData.append("designFile", uploadFile);
      }

      await import("axios").then(axios =>
        axios.default.post(`${import.meta.env.VITE_API_URL}/api/cart/add`,
          formData,
          { headers: { "auth-token": token, "Content-Type": "multipart/form-data" } })
      );

      alert("Added to cart successfully!");
      if (fetchCartCount) fetchCartCount();
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white pt-24">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <div
            className="w-full aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
            style={{
              backgroundImage: media ? `url(${media})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {previewUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="flex items-center justify-center bg-white/80"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: shape === "Circle" ? 9999 : shape === "Square" ? 6 : 12,
                  overflow: "hidden",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                  border: "2px solid #fff",
                }}
              >
                <img src={previewUrl} alt="logo" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
          )}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow">
            <FaChevronLeft size={16} />
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow">
            <FaChevronRight size={16} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="text-2xl font-bold text-[#02192F]">{name}</div>
          <div className="text-sm text-gray-600">{category}</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-[#02192F]">₹{basePrice}</div>
            <div className="text-gray-400 line-through">₹{oldPrice}</div>
            <div className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">SAVE 23%</div>
          </div>
          <div>
            <div>
              <div>
                <div className="flex-1">
                  <button onClick={() => fileRef.current?.click()} className="w-full bg-[#F59E0B] text-white font-semibold py-3 rounded-lg text-sm">
                    {uploadFile ? "Change Design File" : "Upload Design (Image/Video) (Optional)"}
                  </button>
                  <div className="text-xs text-gray-500 mt-1 text-center">Max size: 50MB</div>
                  <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                  {uploadFile && <p className="text-xs text-blue-600 mt-1 font-semibold truncate">Selected: {uploadFile.name}</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm text-green-700 bg-green-100 px-3 py-2 rounded-lg">
            We’ll send design preview for approval after order is Placed/Confirmed.
          </div>
          <div className="text-sm text-orange-700 bg-orange-100 px-3 py-2 rounded-lg">
            82% Customers choose the 20 pcs pack because it reduces the cost per badge.
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Shape</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {shapeOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setShape(s)}
                  className={`px-3 py-1.5 rounded-md text-sm border ${shape === s ? "bg-[#02192F] text-white border-[#02192F]" : "border-gray-300 text-gray-800"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Quantity</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {packOptions.map((p) => (
                <button
                  key={p}
                  onClick={() => setPack(p)}
                  className={`px-3 py-1.5 rounded-md text-sm border ${pack === p ? "bg-[#02192F] text-white border-[#02192F]" : "border-gray-300 text-gray-800"}`}
                >
                  {typeof p === "number" ? `${p} Pcs` : p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Total: ₹{total}</div>
          </div>
          <div>
            <button onClick={onAddToCart} disabled={loading} className="w-full bg-[#DB2A7B] text-white font-semibold py-3 rounded-lg active:scale-95 disabled:opacity-50">
              {loading ? "ADDING..." : "ADD TO CART"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProviderProductDetail;