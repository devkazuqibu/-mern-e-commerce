import mongoose from "mongoose";

// Định nghĩa schema cho Product (sản phẩm)
const productSchema = new mongoose.Schema(
	{
		// Tên sản phẩm - bắt buộc nhập
		name: {
			type: String,
			required: true, // Bắt buộc nhập
		},

		// Mô tả sản phẩm - bắt buộc nhập
		description: {
			type: String,
			required: true, // Bắt buộc nhập
		},

		// Giá sản phẩm - phải >= 0 và bắt buộc nhập
		price: {
			type: Number,
			min: 0,         // Giá phải >= 0
			required: true, // Bắt buộc nhập
		},

		// Đường dẫn hình ảnh sản phẩm - bắt buộc nhập
		image: {
			type: String,
			required: [true, "Image is required"], // Nếu không có ảnh, sẽ trả về thông báo lỗi "Image is required"
		},

		// Danh mục sản phẩm - bắt buộc nhập
		category: {
			type: String,
			required: true, // Bắt buộc nhập
		},

		// Trạng thái nổi bật của sản phẩm - mặc định là false (không nổi bật)
		isFeatured: {
			type: Boolean,
			default: false,  // Mặc định là không nổi bật
		},
	},
	{ timestamps: true } // Tự động thêm các trường "createdAt" và "updatedAt"
);

// Tạo model Product từ schema trên
const Product = mongoose.model("products", productSchema);

// Xuất model để sử dụng ở các file khác
export default Product;
