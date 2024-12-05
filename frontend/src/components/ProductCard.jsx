import toast from "react-hot-toast"; // Thư viện để hiển thị thông báo
import { ShoppingCart } from "lucide-react"; // Biểu tượng giỏ hàng từ Lucide
import { useUserStore } from "../stores/useUserStore"; // Hook để lấy thông tin người dùng
import { useCartStore } from "../stores/useCartStore"; // Hook để quản lý giỏ hàng
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const ProductCard = ({ product }) => {
	const { user } = useUserStore(); // Lấy thông tin người dùng từ user store
	const { addToCart } = useCartStore(); // Lấy hàm addToCart từ cart store
	const [rating, setRating] = useState(5); // Mặc định 5 sao đầy sáng

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
	const handleRating = (index) => {
		setRating(index + 1);
	};

	return (
		<div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
			{/* Hình ảnh sản phẩm */}
			<div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
				<img className='object-cover w-full' src={product.image} alt='product image' />
				<div className='absolute inset-0 bg-black bg-opacity-20' />
			</div>

			<div className='mt-4 px-5 pb-5'>
				{/* Tên sản phẩm */}
				<h5 className='text-xl font-semibold tracking-tight text-white'>{product.name}</h5>
				
				{/* Mô tả sản phẩm */}
				{/* <p className='mt-2 text-sm text-gray-300'>{product.description}</p>  */}
				
				<div className='mt-2 mb-5 flex items-center justify-between'>
					{/* Giá sản phẩm */}
					<p>
						<span className='text-3xl font-bold text-emerald-400'>${product.price}</span>
					</p>
				</div>

				{/* Đánh giá sản phẩm */}
				<div className='flex items-center mb-4'>
					{[...Array(5)].map((_, index) => (
						<FontAwesomeIcon
							key={index}
							icon={faStar}
							className={`h-6 w-6 cursor-pointer ${index < rating ? 'text-yellow-400' : 'text-gray-500'}`}
							onClick={() => handleRating(index)}
						/>
					))}
				</div>
				
				{/* Nút thêm vào giỏ hàng */}
				<button
					className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					onClick={handleAddToCart}
				>
					<ShoppingCart size={22} className='mr-2' /> {/* Biểu tượng giỏ hàng */}
					Add to cart {/* Nội dung nút */}
				</button>
			</div>
		</div>
	);
};

export default ProductCard; // Xuất thành phần ProductCard để sử dụng ở nơi khác
