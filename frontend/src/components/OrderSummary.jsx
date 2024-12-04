import { motion } from "framer-motion"; // Import animation từ Framer Motion
import { useCartStore } from "../stores/useCartStore"; // Import hook quản lý giỏ hàng
import { Link } from "react-router-dom"; // Import Link để điều hướng trong React Router
import { MoveRight } from "lucide-react"; // Import biểu tượng mũi tên từ thư viện "lucide-react"
import { loadStripe } from "@stripe/stripe-js"; // Import Stripe để xử lý thanh toán
import axios from "../lib/axios"; // Import axios để gọi API

// Khởi tạo đối tượng Stripe với khoá công khai
const stripePromise = loadStripe(
	"pk_test_51QNu72At6u7PcqFEZWag9HBWPxUTHmZHlg1ivdcakjgkmyoSaKSsSIhfsyF7IRyT2TNvRc8nI0bwswFCkjkPXPHw00zs0zPpCG"
);

// Thành phần hiển thị phần tóm tắt đơn hàng
const OrderSummary = () => {
	// Lấy thông tin từ giỏ hàng
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

	// Tính toán các giá trị
	const savings = subtotal - total; // Số tiền tiết kiệm được
	const formattedSubtotal = subtotal.toFixed(2); // Định dạng giá trị ban đầu
	const formattedTotal = total.toFixed(2); // Định dạng tổng giá trị
	const formattedSavings = savings.toFixed(2); // Định dạng số tiền tiết kiệm

	// Xử lý thanh toán
	const handlePayment = async () => {
		const stripe = await stripePromise; // Khởi tạo đối tượng Stripe
		const res = await axios.post("/payments/create-checkout-session", {
			products: cart, // Gửi danh sách sản phẩm trong giỏ hàng
			couponCode: coupon ? coupon.code : null, // Gửi mã giảm giá nếu có
		});

		const session = res.data; // Nhận thông tin phiên giao dịch từ server
		console.log("session is here", session); // Debug thông tin phiên giao dịch

		// Điều hướng đến trang thanh toán của Stripe
		const result = await stripe.redirectToCheckout({
			sessionId: session.id, // ID phiên giao dịch
		});

		// Xử lý lỗi nếu xảy ra trong quá trình thanh toán
		if (result.error) {
			console.error("Lỗi:", result.error);
		}
	};

	// Giao diện hiển thị
	return (
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6' // Các lớp CSS cho phần tử
			initial={{ opacity: 0, y: 20 }} // Trạng thái ban đầu của animation
			animate={{ opacity: 1, y: 0 }} // Trạng thái sau animation
			transition={{ duration: 0.5 }} // Thời gian chuyển đổi
		>
			{/* Tiêu đề phần tóm tắt */}
			<p className='text-xl font-semibold text-emerald-400'>Tóm tắt đơn hàng</p>

			<div className='space-y-4'>
				{/* Hiển thị thông tin giá */}
				<div className='space-y-2'>
					<dl className='flex items-center justify-between gap-4'>
						<dt className='text-base font-normal text-gray-300'>Giá gốc</dt>
						<dd className='text-base font-medium text-white'>${formattedSubtotal}</dd>
					</dl>

					{/* Hiển thị tiết kiệm nếu có */}
					{savings > 0 && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Tiết kiệm</dt>
							<dd className='text-base font-medium text-emerald-400'>-${formattedSavings}</dd>
						</dl>
					)}

					{/* Hiển thị mã giảm giá nếu áp dụng */}
					{coupon && isCouponApplied && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Mã giảm giá ({coupon.code})</dt>
							<dd className='text-base font-medium text-emerald-400'>-{coupon.discountPercentage}%</dd>
						</dl>
					)}

					{/* Hiển thị tổng cộng */}
					<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
						<dt className='text-base font-bold text-white'>Tổng cộng</dt>
						<dd className='text-base font-bold text-emerald-400'>${formattedTotal}</dd>
					</dl>
				</div>

				{/* Nút thực hiện thanh toán */}
				<motion.button
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }} // Animation khi di chuột qua
					whileTap={{ scale: 0.95 }} // Animation khi nhấn nút
					onClick={handlePayment}
				>
					Thanh toán ngay
				</motion.button>

				{/* Liên kết quay lại mua sắm */}
				<div className='flex items-center justify-center gap-2'>
					<span className='text-sm font-normal text-gray-400'>hoặc</span>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
					>
						Tiếp tục mua sắm
						<MoveRight size={16} /> {/* Biểu tượng mũi tên */}
					</Link>
				</div>
			</div>
		</motion.div>
	);
};

export default OrderSummary; // Xuất thành phần để sử dụng ở nơi khác
