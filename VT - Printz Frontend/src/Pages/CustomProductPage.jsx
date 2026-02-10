import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { MyContext } from '../ContextAPI';

const CustomProductPage = () => {
  const { categorySlug, serviceSlug, subSlug } = useParams();
  const navigate = useNavigate();
  const { fetchCartCount } = React.useContext(MyContext) || {};

  const [catalogData, setCatalogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShape, setSelectedShape] = useState('Logo Cutout');
  const [selectedQuantity, setSelectedQuantity] = useState('10 Pcs');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [customizationText, setCustomizationText] = useState('');
  const fileInputRef = useRef(null);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/catalog/full-catalog`);
        setCatalogData(res.data);
      } catch (error) {
        console.error("Failed to load catalog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Poll for updates every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="animate-spin text-[#DB2A7B]" size={48} />
      </div>
    );
  }

  // Find the correct product/service based on slugs from the loaded data
  const category = catalogData.find(c => c.categorySlug === categorySlug);
  const service = category?.services.find(s => s.slug === serviceSlug);

  // If there's a subSlug, find the subcategory. Otherwise, use the service itself.
  const product = subSlug
    ? service?.subcategories.find(sub => sub.slug === subSlug)
    : service;



  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    const productId = product?._id;
    const qty = parseInt(selectedQuantity) || 1;

    if (!productId) {
      alert("Product ID not found.");
      return;
    }

    if (!token) {
      const pendingItem = {
        type: 'custom',
        productId,
        quantity: qty,
        // We can't easily store the file, so we might lose it or have to handle it differently.
        // For now, we'll store basic info and user might need to re-upload if logic requires file.
      };
      localStorage.setItem('pendingCartItem', JSON.stringify(pendingItem));
      alert("Please login to add to cart.");
      navigate("/login-and-signup");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("quantity", qty);

      const note = customizationText
        ? `${customizationText} | Shape: ${selectedShape}`
        : `Shape: ${selectedShape}`;
      formData.append("customizationNote", note);

      if (uploadedFile) {
        formData.append("designFile", uploadedFile);
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/add`,
        formData,
        { headers: { "auth-token": token, "Content-Type": "multipart/form-data" } }
      );
      alert("Added to cart successfully!");
      if (fetchCartCount) fetchCartCount();
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart");
    }
  };

  if (!product) {
    return (
      <div className="pt-32 text-center text-red-500">
        Product details not found!
      </div>
    );
  }

  // Mock data based on the image
  const reviews = {
    rating: 4.4,
    count: 1485,
  };
  const price = {
    original: product.originalPrice || 0,
    discounted: product.discountedPrice || 0,
    savePercent: product.originalPrice ? Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100) : 0,
  };
  const shapes = ['Logo Cutout', 'Circle', 'Square'];
  const quantities = ['1 Pcs', '10 Pcs', '20 Pcs', '50 Pcs', '100 Pcs', '3 Pieces Sample'];

  return (
    <div className="bg-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-blue-600 hover:underline"
        >
          &larr; Back
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="flex items-center justify-center aspect-square">
            {/* Placeholder for image gallery */}
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customized {product.title}</h1>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.round(reviews.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.365-2.446a1 1 0 00-1.175 0l-3.365 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.34 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 ml-2">{reviews.rating} ({reviews.count} Reviews)</span>
            </div>

            <div className="mt-4">
              <span className="text-3xl font-bold text-gray-900">₹{product.discountedPrice}</span>
              <span className="text-xl text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
              <span className="ml-4 text-sm font-semibold text-green-600">
                ({Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)}% off)
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Inclusive of All Taxes</p>

            <div className="mt-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition duration-300"
              >
                {uploadedFile ? `File: ${uploadedFile.name}` : 'Upload  Your File'}
              </button>

              <div className="mt-3 text-center bg-green-100 text-green-800 p-3 rounded-lg">
                <p>We'll send design preview for approval after order is Placed/Confirmed.</p>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="customization" className="text-sm font-medium text-gray-700">Any Text or Customization Needed (Optional)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="customization"
                  value={customizationText}
                  onChange={(e) => setCustomizationText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write Here"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>


            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-900">SHAPE: <span className="font-normal">{selectedShape}</span></h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {shapes.map(shape => (
                  <button key={shape} onClick={() => setSelectedShape(shape)} className={`px-4 py-2 border rounded-lg ${selectedShape === shape ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300'}`}>
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-900">QUANTITY: <span className="font-normal">{selectedQuantity}</span></h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {quantities.map(quantity => (
                  <button key={quantity} onClick={() => setSelectedQuantity(quantity)} className={`px-4 py-2 border rounded-lg ${selectedQuantity === quantity ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300'}`}>
                    {quantity}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition duration-300"
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomProductPage;
