import mongoose from "mongoose";

// Định nghĩa schema cho Coupon (mã giảm giá)
const couponSchema = new mongoose.Schema(
	{
		// Mã giảm giá (code) - phải là một chuỗi và duy nhất
		code: {
			type: String,
			required: true,  // Bắt buộc nhập
			unique: true,    // Mã giảm giá phải là duy nhất
		},
		
		// Tỷ lệ giảm giá (discountPercentage) - kiểu số, bắt buộc và nằm trong khoảng từ 0 đến 100
		discountPercentage: {
			type: Number,
			required: true,  // Bắt buộc nhập
			min: 0,          // Tỷ lệ không được nhỏ hơn 0
			max: 100,        // Tỷ lệ không được lớn hơn 100
		},
		
		// Ngày hết hạn của mã giảm giá (expirationDate) - kiểu Date, bắt buộc nhập
		expirationDate: {
			type: Date,
			required: true,  // Bắt buộc nhập
		},
		
		// Trạng thái kích hoạt của mã giảm giá (isActive) - mặc định là true
		isActive: {
			type: Boolean,
			default: true,   // Mặc định là mã giảm giá còn hiệu lực
		},
		
		// ID của người dùng sở hữu mã giảm giá - liên kết với model "User"
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",      // Tham chiếu tới model "User"
			required: true,   // Bắt buộc nhập
			unique: true,     // Mỗi người dùng chỉ có thể có một mã giảm giá
		},
	},
	{
		timestamps: true,   // Tự động thêm các trường "createdAt" và "updatedAt"
	}
);

// Tạo model Coupon từ schema trên
const Coupon = mongoose.model("Coupon", couponSchema);

// Xuất model để sử dụng ở các file khác
export default Coupon;
