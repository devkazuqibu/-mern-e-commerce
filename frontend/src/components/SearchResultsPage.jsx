import { useLocation } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

const SearchResultsPage = () => {
  const location = useLocation();
  const products = location.state?.products || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-emerald-400 mb-4">Kết quả tìm kiếm</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-300">Không tìm thấy sản phẩm phù hợp với từ khóa của bạn.</p>
      )}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { user } = useUserStore(); // Lấy thông tin người dùng từ user store
  const { addToCart } = useCartStore(); // Lấy hàm addToCart từ cart store


  // Hàm xử lý khi người dùng thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    if (!user) {
      // Nếu người dùng chưa đăng nhập, hiển thị thông báo lỗi
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    } else {
      // Nếu người dùng đã đăng nhập, thêm sản phẩm vào giỏ hàng
      addToCart(product);
    }
  };

  // Hàm để cập nhật đánh giá

  return (
    <div className="border rounded-md p-4 shadow-sm bg-gray-800">
      <img
        src={product.image}
        alt={product.name}
        className="h-40 w-full object-cover rounded mb-4"
      />
      <h3 className="text-lg font-semibold text-white">{product.name}</h3>
      <p className="text-gray-400">{product.description}</p>
      <p className="text-emerald-400 font-bold mt-2">${product.price}</p>

      {/* Nút thêm vào giỏ hàng */}
      <button
        className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
           text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
        onClick={handleAddToCart}
      >
        <ShoppingCart size={22} className="mr-2" />
        Add to cart
      </button>
    </div>
  );
};

export default SearchResultsPage;
