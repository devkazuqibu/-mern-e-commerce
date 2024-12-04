import { useEffect, useState } from "react"; // Import các hook cần thiết từ React
import ProductCard from "./ProductCard"; // Import thành phần hiển thị thông tin sản phẩm
import axios from "../lib/axios"; // Import cấu hình axios để gọi API
import toast from "react-hot-toast"; // Import thư viện thông báo toast
import LoadingSpinner from "./LoadingSpinner"; // Import thành phần hiển thị biểu tượng tải

// Thành phần gợi ý sản phẩm "Người khác cũng đã mua"
const PeopleAlsoBought = () => {
	const [recommendations, setRecommendations] = useState([]); // Khởi tạo state để lưu danh sách sản phẩm gợi ý
	const [isLoading, setIsLoading] = useState(true); // State để quản lý trạng thái tải

	useEffect(() => {
		// Hàm bất đồng bộ để gọi API lấy dữ liệu sản phẩm gợi ý
		const fetchRecommendations = async () => {
			try {
				const res = await axios.get("/products/recommendations"); // Gửi yêu cầu GET đến endpoint API
				setRecommendations(res.data); // Lưu dữ liệu sản phẩm vào state
			} catch (error) {
				// Xử lý lỗi nếu có
				toast.error(
					error.response.data.message || "Đã xảy ra lỗi khi lấy danh sách gợi ý" // Hiển thị thông báo lỗi
				);
			} finally {
				setIsLoading(false); // Đặt trạng thái tải là hoàn tất (dù thành công hay lỗi)
			}
		};

		fetchRecommendations(); // Gọi hàm khi thành phần được render
	}, []); // Mảng phụ thuộc trống để chỉ chạy một lần khi thành phần được gắn

	// Nếu đang tải, hiển thị biểu tượng tải
	if (isLoading) return <LoadingSpinner />;

	return (
		<div className='mt-8'> {/* Khoảng cách trên cùng */}
			<h3 className='text-2xl font-semibold text-emerald-400'>Người khác cũng đã mua</h3> {/* Tiêu đề */}
			<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'> {/* Bố cục lưới */}
				{/* Lặp qua danh sách sản phẩm gợi ý và hiển thị từng sản phẩm */}
				{recommendations.map((product) => (
					<ProductCard key={product._id} product={product} /> // Thành phần hiển thị thông tin sản phẩm
				))}
			</div>
		</div>
	);
};

export default PeopleAlsoBought; // Xuất thành phần để sử dụng ở nơi khác
