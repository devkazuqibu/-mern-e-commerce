import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"; // Nhập các biểu tượng để sử dụng
import { useCartStore } from "../stores/useCartStore"; // Hook để quản lý giỏ hàng

const FeaturedProducts = ({ featuredProducts }) => {
	// State để theo dõi chỉ số sản phẩm hiện tại và số sản phẩm mỗi trang
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);

	// Hook để truy cập hàm thêm sản phẩm vào giỏ hàng
	const { addToCart } = useCartStore();

	// useEffect để thay đổi số lượng sản phẩm trên mỗi trang khi thay đổi kích thước màn hình
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1); // Nếu màn hình nhỏ hơn 640px, hiển thị 1 sản phẩm mỗi trang
			else if (window.innerWidth < 1024) setItemsPerPage(2); // Nếu màn hình nhỏ hơn 1024px, hiển thị 2 sản phẩm mỗi trang
			else if (window.innerWidth < 1280) setItemsPerPage(3); // Nếu màn hình nhỏ hơn 1280px, hiển thị 3 sản phẩm mỗi trang
			else setItemsPerPage(4); // Màn hình lớn hơn 1280px, hiển thị 4 sản phẩm mỗi trang
		};

		handleResize(); // Gọi hàm ngay khi component được render lần đầu tiên
		window.addEventListener("resize", handleResize); // Lắng nghe sự kiện resize của cửa sổ trình duyệt
		return () => window.removeEventListener("resize", handleResize); // Dọn dẹp sự kiện khi component bị hủy
	}, []); // Chỉ chạy một lần khi component được mount

	// Hàm di chuyển đến trang tiếp theo
	const nextSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
	};

	// Hàm di chuyển về trang trước
	const prevSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
	};

	// Kiểm tra nếu đã ở đầu danh sách, nếu có thì vô hiệu hóa nút prev
	const isStartDisabled = currentIndex === 0;
	// Kiểm tra nếu đã ở cuối danh sách, nếu có thì vô hiệu hóa nút next
	const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

	return (
		<div className="py-12">
			{/* Container chính chứa các sản phẩm */}
			<div className="container mx-auto px-4">
				<h2 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
					Featured {/* Tiêu đề của phần sản phẩm nổi bật */}
				</h2>
				<div className="relative">
					{/* Phần chứa các sản phẩm */}
					<div className="overflow-hidden">
						{/* Phần flex để sắp xếp các sản phẩm theo chiều ngang */}
						<div
							className="flex transition-transform duration-300 ease-in-out"
							style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
						>
							{/* Lặp qua các sản phẩm để hiển thị chúng */}
							{featuredProducts?.map((product) => (
								<div key={product._id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2">
									<div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30">
										<div className="overflow-hidden">
											{/* Hiển thị hình ảnh sản phẩm */}
											<img
												src={product.image}
												alt={product.name}
												className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110"
											/>
										</div>
										<div className="p-4">
											{/* Hiển thị tên sản phẩm */}
											<h3 className="text-lg font-semibold mb-2 text-white">{product.name}</h3>
											{/* Hiển thị giá sản phẩm */}
											<p className="text-emerald-300 font-medium mb-4">
												${product.price.toFixed(2)}
											</p>
											{/* Nút thêm sản phẩm vào giỏ hàng */}
											<button
												onClick={() => addToCart(product)}
												className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center"
											>
												{/* Biểu tượng giỏ hàng */}
												<ShoppingCart className="w-5 h-5 mr-2" />
												Add to Cart
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					{/* Nút quay lại trang trước */}
					<button
						onClick={prevSlide}
						disabled={isStartDisabled}
						className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isStartDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
						}`}
					>
						<ChevronLeft className="w-6 h-6" />
					</button>

					{/* Nút chuyển đến trang tiếp theo */}
					<button
						onClick={nextSlide}
						disabled={isEndDisabled}
						className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isEndDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
						}`}
					>
						<ChevronRight className="w-6 h-6" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default FeaturedProducts;
