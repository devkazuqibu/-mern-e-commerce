// Import model Coupon để thao tác với collection Coupon trong MongoDB
import Coupon from "../models/coupon.model.js";

/**
 * Hàm lấy thông tin mã giảm giá (Coupon) cho người dùng hiện tại
 * Điều kiện: mã giảm giá phải thuộc về user và đang hoạt động (isActive = true)
 */
export const getCoupon = async (req, res) => {
	try {
		// Tìm mã giảm giá dựa trên userId và trạng thái hoạt động
		const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
		
		// Trả về mã giảm giá nếu tìm thấy, nếu không thì trả về null
		res.json(coupon || null);
	} catch (error) {
		// Xử lý lỗi trong quá trình lấy mã giảm giá
		console.log("Lỗi trong hàm getCoupon", error.message);
		res.status(500).json({ message: "Lỗi server", error: error.message });
	}
};

/**
 * Hàm kiểm tra tính hợp lệ của mã giảm giá (validate coupon)
 * - Kiểm tra mã giảm giá có tồn tại không
 * - Kiểm tra mã giảm giá đã hết hạn chưa
 */
export const validateCoupon = async (req, res) => {
	try {
		// Lấy mã giảm giá từ body request
		const { code } = req.body;

		// Tìm mã giảm giá dựa trên code, userId và trạng thái hoạt động
		const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });

		// Nếu không tìm thấy mã giảm giá
		if (!coupon) {
			return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
		}

		// Nếu mã giảm giá đã hết hạn
		if (coupon.expirationDate < new Date()) {
			coupon.isActive = false; // Cập nhật trạng thái mã giảm giá
			await coupon.save(); // Lưu vào cơ sở dữ liệu
			return res.status(404).json({ message: "Mã giảm giá đã hết hạn" });
		}

		// Trả về thông tin mã giảm giá nếu hợp lệ
		res.json({
			message: "Mã giảm giá hợp lệ",
			code: coupon.code,
			discountPercentage: coupon.discountPercentage, // Phần trăm giảm giá
		});
	} catch (error) {
		// Xử lý lỗi trong quá trình kiểm tra mã giảm giá
		console.log("Lỗi trong hàm validateCoupon", error.message);
		res.status(500).json({ message: "Lỗi server", error: error.message });
	}
};
