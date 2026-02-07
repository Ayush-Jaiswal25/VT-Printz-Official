import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Local Assets
import RoundTShirt from "../Assets/RoundTShirt.png";
import PoloTShirt from "../Assets/PoloTShirt.png";
import Caps from "../Assets/Caps.jpg";
import CSK from "../Assets/CSKJersy.png";
import Hoodie from "../Assets/Hoodie.png";
import Mugs from "../Assets/Mugs.png";
import Bottle from '../Assets/Bottle1.png';
import Pamplate from '../Assets/Pamplate1.png';
import Canopy from '../Assets/Canopy.jpg';
import main from '../Assets/main.png';

export default function ProductGrid3D() {
  const navigate = useNavigate();
  const [gridItems, setGridItems] = useState([]);
  const [wearItems, setWearItems] = useState([]);

  // Definitions for mapping
  const gridDefaults = [
    { slug: 'custom-coffee-mugs', title: "Custom Coffee Mugs", price: "₹89", img: Mugs, desc: "Vintage vibes.", searchTerm: "mugs" },
    { slug: 'flex-pamphlet-designs', title: "Flex & Pamphlet Designs", price: "₹129", img: Pamplate, desc: "Bright style.", searchTerm: "pamphlet" },
    { slug: 'custom-water-bottle', title: "Custom Water Bottle", price: "₹59", img: Bottle, desc: "Cozy & bold.", searchTerm: "bottle" },
    { slug: 'custom-canopy-tents', title: "Custom Canopy Tents", price: "₹39", img: Canopy, desc: "Shade with attitude.", searchTerm: "canopy" },
    { slug: null, title: "", price: "", img: main, desc: "" } // Center item
  ];

  const wearDefaults = [
    { slug: 'round-neck-t-shirt', title: "Round Neck T-shirt", price: "₹199", img: RoundTShirt, desc: "Premium round-neck custom T-shirt.", searchTerm: "t-shirt" },
    { slug: 'polo-t-shirt-classic', title: "Polo T-shirt Classic", price: "₹299", img: PoloTShirt, desc: "Elegant style.", searchTerm: "polo" },
    { slug: 'custom-hoodies', title: "Custom Hoodies", price: "₹499", img: Hoodie, desc: "Cozy & Bold.", searchTerm: "hoodie" },
    { slug: 'brandy-caps', title: "Brandy Caps", price: "₹99", img: Caps, desc: "Shade with attitude.", searchTerm: "cap" },
    { slug: 'custom-jersey', title: "Custom Jersey", price: "₹249", img: CSK, desc: "Athletic & Durable.", searchTerm: "jersey" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/catalog/products`);
        const apiProducts = res.data;

        // Merge Grid Items
        const newGridItems = gridDefaults.map(def => {
          if (!def.slug) return def; // Skip center item
          const found = apiProducts.find(p => p.slug === def.slug);
          if (found) {
            return {
              ...def,
              title: found.name,
              price: `₹${found.discountedPrice}`,
              desc: found.description,
              img: (found.image && !found.image.includes('placeholder')) ? found.image : def.img,
              searchTerm: found.slug, // search by slug is exact
              // Store all fields needed for provider-product
              fullProduct: found
            };
          }
          return def;
        });
        setGridItems(newGridItems);

        // Merge Wear Items
        const newWearItems = wearDefaults.map(def => {
          const found = apiProducts.find(p => p.slug === def.slug);
          if (found) {
            return {
              ...def,
              title: found.name,
              price: `₹${found.discountedPrice}`,
              desc: found.description,
              img: (found.image && !found.image.includes('placeholder')) ? found.image : def.img,
              searchTerm: found.slug,
              fullProduct: found
            };
          }
          return def;
        });
        setWearItems(newWearItems);

      } catch (err) {
        console.error("Error fetching homepage products:", err);
        setGridItems(gridDefaults);
        setWearItems(wearDefaults);
      }
    };

    fetchData();
  }, []);

  const navigateToProduct = (product) => {
    if (product.fullProduct) {
      navigate("/provider-product", {
        state: {
          item: {
            _id: product.fullProduct._id,
            name: product.fullProduct.name,
            category: product.fullProduct.serviceId?.name || "Custom",
            price: product.fullProduct.discountedPrice || product.fullProduct.price,
            media: product.fullProduct.image || product.fullProduct.media,
            desc: product.fullProduct.description,
            // Pass other potential fields if needed
            ...product.fullProduct
          },
        },
      });
    } else {
      // Fallback if we don't have the full object yet (shouldn't happen if API responds)
      navigate(`/product-list?search=${product.searchTerm || product.title}`);
    }
  };


  // Loading state handling (optional, simply don't render if empty or render defaults initially)
  const displayGrid = gridItems.length > 0 ? gridItems : gridDefaults;
  const displayWear = wearItems.length > 0 ? wearItems : wearDefaults;

  return (
    <div>
      <section className="bg-white px-6 lg:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6 h-full justify-between">
            {displayGrid.slice(0, 2).map((product, idx) => (
              <div
                key={idx}
                onClick={() => navigateToProduct(product)}
                className="bg-white border rounded-2xl shadow-md p-4 text-center flex-1 cursor-pointer hover:shadow-lg transition"
              >
                <h3 className="text-sm font-bold tracking-wide mb-3 uppercase">
                  {product.title}
                </h3>
                <img
                  src={product.img}
                  alt={product.title}
                  className="h-44 w-full object-contain mx-auto"
                />
              </div>
            ))}
          </div>

          {/* CENTER BIG CARD */}
          <div className="lg:col-span-2 bg-white border rounded-3xl shadow-lg p-10 flex flex-col items-center text-center">
            <h3 className="text-sm font-semibold text-gray-500 tracking-widest">
              CUSTOMIZED PREMIUM
            </h3>
            <h1 className="text-4xl md:text-5xl font-extrabold text-orange-500 mt-2">
              CORPORATE GIFTS
            </h1>
            <div className="mt-10 w-full h-80 relative rounded-2xl overflow-hidden">
              <img
                src={displayGrid[4].img}
                alt="Corporate Gifts"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <button
              onClick={() => navigate('/services?category=corporate-gifts')}
              className="mt-10 px-10 py-3 bg-blue-700 text-white font-semibold rounded-full hover:bg-blue-800 transition"
            >
              ORDER NOW
            </button>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6 h-full justify-between">
            {displayGrid.slice(2, 4).map((product, idx) => (
              <div
                key={idx}
                onClick={() => navigateToProduct(product)}
                className="bg-white border rounded-2xl shadow-md p-4 text-center flex-1 cursor-pointer hover:shadow-lg transition"
              >
                <h3 className="text-sm font-bold tracking-wide mb-3 uppercase">
                  {product.title}
                </h3>
                <img
                  src={product.img}
                  alt={product.title}
                  className="h-44 w-full object-contain mx-auto"
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      <div className="min-h-screen bg-gradient-to-b from-[#0C1E33] to-[#02192F] relative overflow-hidden">
        {/* Top gradient separator */}
        <div className="py-[60px] bg-gradient-to-b from-[#ffffff] to-[#0d2134]"></div>

        {/* Floating blob */}
        <div className="absolute bottom-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-[#0085E1]/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="px-4 sm:px-6">
          <h1 className="text-center text-white text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 sm:mb-16 tracking-tight">
            Our Best Custom Wear
          </h1>

          {/* RESPONSIVE GRID */}
          <div className="grid gap-8 sm:gap-10 pb-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto">

            {/* Large featured card */}
            <div className="bg-[#0A1B2E] rounded-3xl p-6 sm:p-8 shadow-neu hover:shadow-neu-hover transition-transform duration-500 transform hover:-translate-y-2 col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 sm:row-span-2">
              <img
                src={displayWear[0].img}
                alt={displayWear[0].title}
                className="w-full h-52 sm:h-64 lg:h-64 object-cover rounded-2xl mb-5"
              />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {displayWear[0].title}
              </h2>
              <p className="text-gray-300 text-sm sm:text-base mb-5 leading-relaxed">
                {displayWear[0].desc}
              </p>
              <div className="flex md:mt-32 items-center justify-between ">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0085E1]">{displayWear[0].price}</span>
                <button
                  onClick={() => navigateToProduct(displayWear[0])}
                  className="px-5 sm:px-6 py-2 rounded-full bg-[#DB2A7B] text-white font-semibold shadow-neu-button hover:bg-[#9A1E85] transition"
                >
                  View
                </button>
              </div>
            </div>

            {/* Smaller cards */}
            {displayWear.slice(1).map((product, idx) => (
              <div
                key={idx}
                className="bg-[#0A1B2E] rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-neu hover:shadow-neu-hover transition-transform duration-500 transform hover:-translate-y-2"
              >
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-full h-40 sm:h-48 object-cover rounded-2xl mb-4"
                />
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">{product.title}</h2>
                <p className="text-gray-300 text-sm sm:text-base mb-4 leading-relaxed line-clamp-3">
                  {product.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl font-bold text-[#0085E1]">{product.price}</span>
                  <button
                    onClick={() => navigateToProduct(product)}
                    className="px-4 py-2 rounded-full bg-[#DB2A7B] text-white font-medium shadow-neu-button hover:bg-[#9A1E85] transition"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient separator */}
        <div className="py-[60px] bg-gradient-to-b from-[#0d2134] to-[#F7F8FF]"></div>

        <style>
          {`
            .shadow-neu {
              box-shadow: 8px 8px 20px rgba(0,0,0,0.4), -8px -8px 20px rgba(255,255,255,0.05);
            }
            .shadow-neu-hover {
              box-shadow: 12px 12px 28px rgba(0,0,0,0.5), -12px -12px 28px rgba(255,255,255,0.07);
            }
            .shadow-neu-button {
              box-shadow: 4px 4px 12px rgba(0,0,0,0.4), -4px -4px 12px rgba(255,255,255,0.05);
            }
          `}
        </style>
      </div>
    </div>
  );
}
