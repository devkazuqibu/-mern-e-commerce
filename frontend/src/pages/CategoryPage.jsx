import { useEffect } from "react"; // Hook useEffect để theo dõi thay đổi trạng thái
import { useProductStore } from "../stores/useProductStore"; // Custom hook để truy xuất dữ liệu sản phẩm
import { useParams } from "react-router-dom"; // Hook để lấy tham số từ URL
import { motion } from "framer-motion"; // Thư viện Framer Motion cho hiệu ứng hoạt hình
import ProductCard from "../components/ProductCard"; // Component hiển thị sản phẩm

const CategoryPage = () => {
	// Lấy các sản phẩm và hàm fetchProductsByCategory từ store
	const { fetchProductsByCategory, products } = useProductStore();
  
	// Lấy tham số category từ URL
	const { category } = useParams();
  
	// Gọi fetchProductsByCategory mỗi khi category thay đổi
	useEffect(() => {
		fetchProductsByCategory(category);
	}, [fetchProductsByCategory, category]);

	// In ra sản phẩm để kiểm tra
	console.log("products:", products);
  
	return (
		<div className='min-h-screen'>
			{/* Container cho nội dung trang */}
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				{/* Hiển thị tiêu đề trang */}
				<motion.h1
					className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8'
					initial={{ opacity: 0, y: -20 }} // Vị trí ban đầu của tiêu đề
					animate={{ opacity: 1, y: 0 }} // Vị trí cuối cùng của tiêu đề
					transition={{ duration: 0.8 }} // Thời gian chuyển động
				>
					{/* Đổi chữ cái đầu tiên của category thành chữ hoa */}
					{category.charAt(0).toUpperCase() + category.slice(1)}
				</motion.h1>

				{/* Danh sách sản phẩm */}
				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
					initial={{ opacity: 0, y: 20 }} // Vị trí ban đầu của các sản phẩm
					animate={{ opacity: 1, y: 0 }} // Vị trí cuối cùng của các sản phẩm
					transition={{ duration: 0.8, delay: 0.2 }} // Thời gian chuyển động và độ trễ
				>
					{/* Nếu không có sản phẩm, hiển thị thông báo */}
					{products?.length === 0 && (
						<h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
							No products found
						</h2>
					)}

					{/* Hiển thị từng sản phẩm trong danh sách */}
					{products?.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</motion.div>
			</div>
		</div>
	);
};
export default CategoryPage;
