import { motion } from "framer-motion"; // Nhập thư viện Framer Motion để sử dụng các hiệu ứng hoạt hình (animation)
import { useEffect, useState } from "react"; // Nhập các hook từ React: useEffect (vòng đời component) và useState (quản lý trạng thái)
import { useCartStore } from "../stores/useCartStore"; // Nhập hook tuỳ chỉnh quản lý giỏ hàng từ store

// Thành phần hiển thị ô nhập mã giảm giá hoặc voucher
const GiftCouponCard = () => {
	// Khai báo state để lưu trữ mã giảm giá người dùng nhập
	const [userInputCode, setUserInputCode] = useState("");
	// Lấy các giá trị và hàm từ hook quản lý giỏ hàng
	const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

	// Lấy mã giảm giá hiện tại khi tải thành phần (component)
	useEffect(() => {
		getMyCoupon(); // Lấy mã giảm giá hiện có từ giỏ hàng khi component được render lần đầu
	}, [getMyCoupon]); // useEffect sẽ chạy lại khi getMyCoupon thay đổi

	// Đồng bộ mã giảm giá khi thay đổi trong store
	useEffect(() => {
		if (coupon) setUserInputCode(coupon.code); // Nếu có mã giảm giá trong store, cập nhật giá trị ô nhập
	}, [coupon]); // useEffect sẽ chạy lại mỗi khi coupon thay đổi

	// Hàm xử lý khi người dùng nhấn nút "Áp dụng mã"
	const handleApplyCoupon = () => {
		if (!userInputCode) return; // Nếu mã trống, không làm gì cả
		applyCoupon(userInputCode); // Áp dụng mã giảm giá vào giỏ hàng thông qua hàm applyCoupon
	};

	// Hàm xử lý khi người dùng nhấn nút "Gỡ mã giảm giá"
	const handleRemoveCoupon = async () => {
		await removeCoupon(); // Gọi hàm xóa mã giảm giá
		setUserInputCode(""); // Xóa mã giảm giá trong ô nhập sau khi xóa
	};

	// Giao diện chính của component
	return (
		<motion.div
			className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6" // Kiểu dáng của card (bao bọc ô nhập mã)
			initial={{ opacity: 0, y: 20 }} // Trạng thái ban đầu của animation: mờ và di chuyển từ dưới lên
			animate={{ opacity: 1, y: 0 }} // Trạng thái khi animation kết thúc: hiển thị và ở vị trí ban đầu
			transition={{ duration: 0.5, delay: 0.2 }} // Thời gian chuyển động và độ trễ
		>
			<div className="space-y-4">
				{/* Ô nhập mã giảm giá */}
				<div>
					<label htmlFor="voucher" className="mb-2 block text-sm font-medium text-gray-300">
						Bạn có mã giảm giá hoặc thẻ quà tặng không? {/* Mô tả cho ô nhập mã */}
					</label>
					<input
						type="text"
						id="voucher"
						className="block w-full rounded-lg border border-gray-600 bg-gray-700 
            p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500 
            focus:ring-emerald-500" // Kiểu dáng của ô nhập mã
						placeholder="Nhập mã tại đây" // Placeholder hiển thị trong ô nhập
						value={userInputCode} // Liên kết giá trị của ô nhập với state (userInputCode)
						onChange={(e) => setUserInputCode(e.target.value)} // Cập nhật state khi người dùng nhập giá trị mới
						required // Yêu cầu người dùng nhập mã
					/>
				</div>

				{/* Nút để áp dụng mã giảm giá */}
				<motion.button
					type="button"
					className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
					whileHover={{ scale: 1.05 }} // Tạo hiệu ứng phóng to nhẹ khi hover
					whileTap={{ scale: 0.95 }} // Tạo hiệu ứng thu nhỏ khi click
					onClick={handleApplyCoupon} // Khi nhấn nút, gọi hàm handleApplyCoupon để áp dụng mã
				>
					Áp dụng mã {/* Nội dung của nút */}
				</motion.button>
			</div>

			{/* Hiển thị mã giảm giá đã áp dụng */}
			{isCouponApplied && coupon && (
				<div className="mt-4">
					<h3 className="text-lg font-medium text-gray-300">Mã giảm giá đã áp dụng</h3>
					<p className="mt-2 text-sm text-gray-400">
						{coupon.code} - Giảm {coupon.discountPercentage}% {/* Hiển thị mã giảm giá và tỷ lệ giảm */}
					</p>

					{/* Nút để gỡ mã giảm giá */}
					<motion.button
						type="button"
						className="mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 
            px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none
             focus:ring-4 focus:ring-red-300"
						whileHover={{ scale: 1.05 }} // Tạo hiệu ứng phóng to nhẹ khi hover
						whileTap={{ scale: 0.95 }} // Tạo hiệu ứng thu nhỏ khi click
						onClick={handleRemoveCoupon} // Khi nhấn nút, gọi hàm handleRemoveCoupon để xóa mã
					>
						Gỡ mã giảm giá {/* Nội dung của nút */}
					</motion.button>
				</div>
			)}

			{/* Hiển thị mã giảm giá có sẵn */}
			{coupon && (
				<div className="mt-4">
					<h3 className="text-lg font-medium text-gray-300">Mã giảm giá của bạn:</h3>
					<p className="mt-2 text-sm text-gray-400">
						{coupon.code} - Giảm {coupon.discountPercentage}% {/* Hiển thị mã giảm giá sẵn có và tỷ lệ giảm */}
					</p>
				</div>
			)}
		</motion.div>
	);
};

export default GiftCouponCard; // Xuất thành phần để sử dụng ở nơi khác
