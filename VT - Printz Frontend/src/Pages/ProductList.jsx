import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const ITEMS_PER_PAGE = 8;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState("table");

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/catalog/products?search=${searchQuery}`
        );
        setProducts(res.data);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleDelete = async (id) => {
    // Admin only functionality - disabled for public view
    // await axios.delete(`${import.meta.env.VITE_API_URL}/api/catalog/products/${id}`);
    // setProducts(products.filter((item) => item._id !== id));
    alert("Action not authorized");
  };

  const handleView = (item) => {
    // Navigate to product detail or handle view logic
    // Currently redirecting to home or relevant page as placeholder
    console.log("View product:", item);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 pt-24">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">

        <h2 className="text-2xl font-semibold text-[#02192F] mb-6">
          Search Results: "{searchQuery}"
        </h2>

        {products.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No products found
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    const searchParams = new URLSearchParams();
                    searchParams.set("name", item.name);
                    searchParams.set("category", item.category || "Custom"); // API might return serviceId populated? Check backend.
                    // The backend 'products' endpoint populates 'serviceId'. So item.serviceId.name is category.
                    const catName = item.serviceId?.name || "Custom";
                    searchParams.set("category", catName);
                    searchParams.set("price", item.discountedPrice || item.price);
                    if (item.image) searchParams.set("media", item.image);

                    navigate(`/provider-product?${searchParams.toString()}`, {
                      state: {
                        item: {
                          ...item,
                          category: catName,
                          price: item.discountedPrice || item.price,
                          media: item.image
                        }
                      }
                    });
                  }}
                  className="relative h-64 rounded-xl overflow-hidden shadow-md group cursor-pointer"
                  style={{
                    backgroundImage: `url(${item.image || item.media})`, // Handle both image keys
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition" />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">
                    <h3 className="text-lg font-semibold leading-tight">
                      {item.name}
                    </h3>

                    <p className="text-sm opacity-90">
                      ₹{item.discountedPrice || item.price}
                    </p>

                    <button
                      className="self-start px-4 py-1.5 text-sm rounded-full bg-white text-black hover:bg-gray-200 transition mt-2"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>


          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
