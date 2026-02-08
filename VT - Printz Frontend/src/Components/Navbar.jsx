import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";
import { MyContext } from "../ContextAPI.jsx";


import ArrowDown from "../Assets/next_W.png";
import Search from "../Assets/search.png";
import CartIcon from "../Assets/cart1.png";
import Menu from "../Assets/menu.png";
import CartDrawer from "../Pages/CartDrawer";


const Navbar = () => {

  const [searchParams] = useSearchParams();

  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { cartCount, fetchCartCount } = React.useContext(MyContext);

  const [activeLink, setActiveLink] = useState("");
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);

  const navigate = useNavigate();
  const closeMenu = () => setMenuOpen(false);
  const location = useLocation();

  useEffect(() => {
    fetchCartCount();
  }, [location.pathname]);

  // Sync Search Text with URL
  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchText(query);
      setResults([]); // Clear results dropdown when arriving from a search link
    } else if (location.pathname !== '/product-list') {
      setSearchText("");
    }
  }, [location.search, location.pathname]);


  // Live Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // If search text is empty, clear results and return
      if (!searchText.trim()) {
        setResults([]);
        return;
      }

      try {
        // Use the correct catalog API
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/catalog/products?search=${searchText}`);
        setResults(res.data);
      } catch (err) {
        console.error("Search error:", err);
      }

    }, 300); // 300ms delay for 'as you type' feel

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);


  // ✅ OPEN CART ONLY (NO TOGGLE)
  const handleCartClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login-and-signup");
    } else {
      setShowCart(true);
    }
  };


  const NavLink = ({ label, onClick }) => (
    <button
      onClick={() => {
        setActiveLink(label);
        onClick && onClick();
      }}
      className={`relative py-2 text-lg transition
        after:absolute after:left-0 after:bottom-1 after:h-[2px]
        after:bg-[#DB2A7B] after:w-0 hover:after:w-full
        ${activeLink === label ? "after:w-full text-[#DB2A7B]" : "text-[#02192F]"}
      `}
    >
      {label}
    </button>
  );
  const ProductItem = ({ img, label, path }) => (
    <div
      className="flex items-center gap-4 cursor-pointer"
      onClick={() => {
        setProductsOpen(false);
        setMenuOpen(false);
        navigate(path);
      }}
    >
      <div className="w-14 h-14 bg-[#F5F6FF] rounded-xl flex items-center justify-center border-2 border-[#DB2A7B]">
        <img src={img} className="w-8" />
      </div>
      <span className="text-lg">{label}</span>
    </div>
  );

  return (
    <>
      <nav className="fixed top-0 z-[100] w-full">
        <div className="w-full bg-[#fff] h-[84px] flex items-center pl-4 pr-10 text-white relative shadow-shadow10px shadow-[#000]">

          {/* LOGO */}
          <Link to="/" onClick={closeMenu} className="flex-shrink-0 pb-2">
            <img src="/VT_LogoTSC.png" className="h-16 md:h-20" alt="VT Printz Logo" />
          </Link>

          {/* SEARCH */}
          <div className="absolute left-[40%] -translate-x-1/2 hidden mmmd:flex flex-col items-center w-[420px] focus-within:w-[480px] transition-all duration-300 z-50">
            <div className="w-full flex items-center bg-gray-100 rounded-full shadow-shadow5px shadow-[#8c236c] overflow-hidden">
              <input
                type="text"
                placeholder="Search products..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="flex-1 px-6 py-3 text-gray-800 placeholder-gray-400 rounded-s-full outline-none text-sm border-[1.5px] border-[#DB2A7B]"
              />

              <button className="bg-[#DB2A7B] border-[#DB2A7B] border-[1.5px] hover:bg-[#c8236c] transition px-5 py-3" onClick={() => {
                navigate(`/product-list?search=${searchText}`);
                setResults([]);
              }}>
                <img src={Search} alt="Search" className="h-5 w-5" />
              </button>
            </div>

            {/* LIVE SEARCH RESULTS DROPDOWN */}
            {searchText && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden max-h-[400px] overflow-y-auto w-full">
                <div className="p-2">
                  {results.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => {
                        navigate("/provider-product", {
                          state: {
                            item: {
                              _id: product._id,
                              name: product.name,
                              category: product.serviceId?.name || "Custom",
                              price: product.discountedPrice || product.price,
                              media: product.image || product.media,
                              desc: product.description
                            },
                          },
                        });
                        setSearchText("");
                        setResults([]);
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-pink-50 rounded-lg cursor-pointer transition text-left"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
                        {(product.image || product.media) ? (
                          <img src={product.image || product.media} className="w-full h-full object-cover" alt={product.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">img</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{product.name}</h4>
                        <div className="flex gap-2 text-xs">
                          <span className="text-[#DB2A7B] font-bold">₹{product.discountedPrice || product.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  onClick={() => {
                    navigate(`/product-list?search=${searchText}`);
                    setResults([]);
                  }}
                  className="bg-gray-50 p-2 text-center text-xs font-bold text-[#DB2A7B] cursor-pointer hover:bg-gray-100 border-t"
                >
                  View All Results
                </div>
              </div>
            )}
          </div>

          {/* DESKTOP MENU */}
          <div className="ml-auto hidden mmmd:flex items-center gap-8">

            <Link to="/product-page">
              <NavLink label="Products" />
            </Link>


            <Link to="/about-us"><NavLink label="About Us" /></Link>
            <Link to="/feedback-list"><NavLink label="Feedback" /></Link>

            <button
              onClick={handleCartClick}
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition group"
            >
              <img
                src={CartIcon}
                alt="Cart"
                className="h-5 w-5 group-hover:scale-110 transition"
              />


              <span className="absolute -top-1 -right-1 bg-[#DB2A7B] text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {cartCount}
              </span>
            </button>
          </div>

          {/* HAMBURGER */}
          <button className="ml-auto mmmd:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Hamburger open={menuOpen} />
          </button>
        </div>


        {/* MOBILE MENU */}


        <div
          className={`mmmd:hidden fixed top-[84px] left-0 w-full h-[calc(100vh-84px)]
        bg-[#02192F] text-white p-6 transition-transform duration-300 ease-in-out
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* MOBILE SEARCH */}
          <div className=" flex items-center bg-gray-100 rounded-full w-[320px] focus-within:w-[340px] transition-all duration-300 shadow-shadow5px shadow-[#8c236c] overflow-hidden">
            <input type="text" placeholder="Search products..." className="flex-1 px-6 py-3 text-gray-800 placeholder-gray-400 rounded-s-full outline-none text-sm border-[1.5px] border-[#DB2A7B]" />

            <button className="bg-[#DB2A7B] border-[#DB2A7B] border-[1.5px] hover:bg-[#c8236c] transition px-5 py-3" onClick={() => {
              navigate(`/product-list?search=${searchText}`);
              setSearchText("");
            }}>
              <img src={Search} alt="Search" className="h-5 w-5" />
            </button>
          </div>

          <Link to="/product-page">
            <button onClick={() => { setMobileProductsOpen(!mobileProductsOpen), closeMenu() }} className="flex justify-between w-full">
              Products
            </button>
          </Link>



          <Link onClick={closeMenu} to="/about-us">About Us</Link> <br />
          <Link onClick={closeMenu} to="/feedback-list">Feedback</Link>
          <span className="w-full h-px bg-gray-300 my-2 block" />
          <div onClick={() => { handleCartClick(); closeMenu(); }}>Cart ({cartCount})</div>

        </div>

      </nav>

      {/* ✅ CART DRAWER (OPENED ON CLICK ONLY) */}
      {showCart && (
        <CartDrawer onClose={() => setShowCart(false)} />
      )}
    </>
  );
};

export default Navbar;
function Hamburger({ open }) {


  return (
    <button
      className={`hamburger ${open ? "open" : ""}`}
      aria-label="Menu"
    >
      <span />
      <span />
      <span />
    </button>
  );
}



