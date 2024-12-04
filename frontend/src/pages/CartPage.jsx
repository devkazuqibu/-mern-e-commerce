import { Link } from "react-router-dom"; // Import liên kết để điều hướng giữa các trang
import { useCartStore } from "../stores/useCartStore"; // Import hook để truy cập trạng thái giỏ hàng
import { motion } from "framer-motion"; // Import thư viện Framer Motion để tạo hiệu ứng động
import { ShoppingCart } from "lucide-react"; // Import biểu tượng giỏ hàng
import CartItem from "../components/CartItem"; // Import thành phần hiển thị từng mục trong giỏ hàng
import PeopleAlsoBought from "../components/PeopleAlsoBought"; // Import thành phần gợi ý sản phẩm
import OrderSummary from "../components/OrderSummary"; // Import thành phần tóm tắt đơn hàng
import GiftCouponCard from "../components/GiftCouponCard"; // Import thành phần nhập mã giảm giá

// Thành phần chính của trang giỏ hàng
const CartPage = () => {
	const { cart } = useCartStore(); // Lấy danh sách sản phẩm trong giỏ hàng từ trạng thái toàn cục

	return (
		<div className='py-8 md:py-16'> {/* Khoảng cách padding theo chiều dọc */}
			<div className='mx-auto max-w-screen-xl px-4 2xl:px-0'> {/* Bố cục căn giữa */}
				<div className='mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8'> {/* Bố trí các khối nội dung chính */}
					{/* Khối hiển thị danh sách sản phẩm trong giỏ hàng */}
					<motion.div
						className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl' // Định dạng chiều rộng và căn giữa
						initial={{ opacity: 0, x: -20 }} // Hiệu ứng ban đầu: mờ và lệch sang trái
						animate={{ opacity: 1, x: 0 }} // Hiệu ứng khi xuất hiện: rõ và về vị trí gốc
						transition={{ duration: 0.5, delay: 0.2 }} // Thời gian và độ trễ của hiệu ứng
					>
						{/* Kiểm tra nếu giỏ hàng trống */}
						{cart.length === 0 ? (
							<EmptyCartUI /> // Hiển thị giao diện giỏ hàng trống
						) : (
							<div className='space-y-6'> {/* Khoảng cách giữa các mục */}
								{/* Lặp qua từng sản phẩm trong giỏ hàng và hiển thị */}
								{cart.map((item) => (
									<CartItem key={item._id} item={item} /> // Thành phần hiển thị thông tin sản phẩm
								))}
							</div>
						)}
						{/* Nếu giỏ hàng không trống, hiển thị gợi ý sản phẩm */}
						{cart.length > 0 && <PeopleAlsoBought />}
					</motion.div>

					{/* Khối hiển thị tóm tắt đơn hàng và mã giảm giá nếu giỏ hàng không trống */}
					{cart.length > 0 && (
						<motion.div
							className='mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full' // Định dạng chiều rộng và khoảng cách
							initial={{ opacity: 0, x: 20 }} // Hiệu ứng ban đầu: mờ và lệch sang phải
							animate={{ opacity: 1, x: 0 }} // Hiệu ứng khi xuất hiện: rõ và về vị trí gốc
							transition={{ duration: 0.5, delay: 0.4 }} // Thời gian và độ trễ của hiệu ứng
						>
							<OrderSummary /> {/* Thành phần tóm tắt đơn hàng */}
							<GiftCouponCard /> {/* Thành phần nhập mã giảm giá */}
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CartPage; // Xuất thành phần để sử dụng ở nơi khác

// Thành phần hiển thị giao diện khi giỏ hàng trống
const EmptyCartUI = () => (
	<motion.div
		className='flex flex-col items-center justify-center space-y-4 py-16' // Bố cục căn giữa với khoảng cách
		initial={{ opacity: 0, y: 20 }} // Hiệu ứng ban đầu: mờ và lệch xuống dưới
		animate={{ opacity: 1, y: 0 }} // Hiệu ứng khi xuất hiện: rõ và về vị trí gốc
		transition={{ duration: 0.5 }} // Thời gian của hiệu ứng
	>
		<ShoppingCart className='h-24 w-24 text-gray-300' /> {/* Biểu tượng giỏ hàng */}
		<h3 className='text-2xl font-semibold '>Giỏ hàng của bạn đang trống</h3> {/* Tiêu đề */}
		<p className='text-gray-400'>Có vẻ như bạn chưa thêm bất kỳ sản phẩm nào vào giỏ hàng.</p> {/* Thông báo */}
		<Link
			className='mt-4 rounded-md bg-emerald-500 px-6 py-2 text-white transition-colors hover:bg-emerald-600' // Nút điều hướng
			to='/'
		>
			Bắt đầu mua sắm {/* Văn bản trên nút */}
		</Link>
	</motion.div>
);
