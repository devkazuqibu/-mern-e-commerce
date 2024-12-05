import {
  ShoppingCart,
  UserPlus,
  LogIn,
  LogOut,
  Lock,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSearch = async (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      try {
        const response = await axios.get(
          `/api/products/search?query=${searchQuery}`
        );
        navigate("/search-results", { state: { products: response.data } });
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      }
    }
  };

  // Carousel logic for the top banner
  const carouselRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const maxScrollLeft =
          carouselRef.current.scrollWidth - carouselRef.current.clientWidth;

        if (carouselRef.current.scrollLeft >= maxScrollLeft) {
          carouselRef.current.scrollLeft = 0;
        } else {
          carouselRef.current.scrollLeft += 5; // Increment scrolling
        }
      }
    }, 50); // Adjust speed

    return () => clearInterval(interval); // Clean up interval
  }, []);

  return (
    <>
      {/* Top Carousel */}
      <div className="bg-emerald-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div
              ref={carouselRef}
              className="overflow-hidden whitespace-nowrap flex gap-10"
            >
              <span className="text-lg">
                🎉 Chào mừng bạn đến với KhoaKhoa! Ưu đãi đặc biệt cho mùa lễ hội!
                🎉
              </span>
              <span className="text-lg">
                🛍️ Mua ngay để nhận ưu đãi giảm giá 50%! 🛍️
              </span>
              <span className="text-lg">
                🔥 Sản phẩm mới ra mắt - Xem ngay các bộ sưu tập mới nhất! 🔥
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex"
            >
              E-Commerce
            </Link>

            {/* Menu toggle button for mobile */}
            <button onClick={toggleMenu} className="lg:hidden text-gray-300">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Search Bar */}
            <div className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search products..."
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* Navigation Links */}
            <nav
              className={`lg:flex flex-col lg:flex-row items-center gap-4 ${
                menuOpen ? "block" : "hidden"
              }`}
            >
              <Link
                to={"/"}
                className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
              >
                Home
              </Link>

              {user && (
                <Link
                  to={"/cart"}
                  className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
                >
                  <ShoppingCart
                    className="inline-block mr-1 group-hover:text-emerald-400"
                    size={20}
                  />
                  <span className="hidden sm:inline">Cart</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                      {cart.length}
                    </span>
                  )}
                </Link>
              )}

              {isAdmin && (
                <Link
                  to={"/secret-dashboard"}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
                >
                  <Lock className="inline-block mr-1" size={18} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}

              {user ? (
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                  onClick={logout}
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline ml-2">Log Out</span>
                </button>
              ) : (
                <>
                  <Link
                    to={"/signup"}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                  >
                    <UserPlus className="mr-2" size={18} />
                    Sign Up
                  </Link>
                  <Link
                    to={"/login"}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                  >
                    <LogIn className="mr-2" size={18} />
                    Login
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
