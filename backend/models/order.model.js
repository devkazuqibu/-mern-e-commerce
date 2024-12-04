import mongoose from "mongoose";

// Định nghĩa schema cho Order (đơn hàng)
const orderSchema = new mongoose.Schema(
	{
		// ID của người dùng tạo đơn hàng - liên kết với model "User"
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",       // Tham chiếu tới model "User"
			required: true,    // Bắt buộc nhập
		},

		// Danh sách sản phẩm trong đơn hàng
		products: [
			{
				// ID sản phẩm - liên kết với model "Product"
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product", // Tham chiếu tới model "Product"
					required: true, // Bắt buộc nhập
				},
				// Số lượng của sản phẩm trong đơn hàng
				quantity: {
					type: Number,
					required: true, // Bắt buộc nhập
					min: 1,         // Số lượng phải >= 1
				},
				// Giá của sản phẩm trong đơn hàng
				price: {
					type: Number,
					required: true, // Bắt buộc nhập
					min: 0,         // Giá phải >= 0
				},
			},
		],

		// Tổng số tiền của đơn hàng
		totalAmount: {
			type: Number,
			required: true, // Bắt buộc nhập
			min: 0,         // Tổng tiền phải >= 0
		},

		// ID session của Stripe (nếu có)
		stripeSessionId: {
			type: String,
			unique: true,    // Mã session Stripe phải duy nhất
		},
	},
	{ timestamps: true } // Tự động thêm các trường "createdAt" và "updatedAt"
);

// Tạo model Order từ schema trên
const Order = mongoose.model("Order", orderSchema);

// Xuất model để sử dụng ở các file khác
export default Order;
