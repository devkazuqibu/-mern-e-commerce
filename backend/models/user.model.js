import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Định nghĩa schema cho User (người dùng)
const userSchema = new mongoose.Schema(
	{
		// Tên người dùng - bắt buộc nhập
		name: {
			type: String,
			required: [true, "Name is required"], // Nếu không có tên, sẽ trả về lỗi "Name is required"
		},

		// Email người dùng - bắt buộc nhập, duy nhất và tự động chuyển thành chữ thường
		email: {
			type: String,
			required: [true, "Email is required"], // Nếu không có email, sẽ trả về lỗi "Email is required"
			unique: true,    // Email phải là duy nhất
			lowercase: true, // Tự động chuyển email thành chữ thường
			trim: true,      // Loại bỏ khoảng trắng thừa ở đầu và cuối email
		},

		// Mật khẩu của người dùng - bắt buộc nhập và phải có độ dài tối thiểu là 6 ký tự
		password: {
			type: String,
			required: [true, "Password is required"], // Nếu không có mật khẩu, sẽ trả về lỗi "Password is required"
			minlength: [6, "Password must be at least 6 characters long"], // Mật khẩu phải dài ít nhất 6 ký tự
		},
		address: {
			type: String,
			required: [false, "Address is required"], // Địa chỉ là trường bắt buộc
			trim: true, // Loại bỏ khoảng trắng thừa ở đầu và cuối
		},

		// Số điện thoại
		phone: {
			type: String,
			required: [false, "Phone number is required"], // Số điện thoại là trường bắt buộc
			unique: false, // Số điện thoại phải là duy nhất
		},
	
		// Danh sách các sản phẩm trong giỏ hàng của người dùng
		cartItems: [
			{
				// Số lượng sản phẩm trong giỏ hàng
				quantity: {
					type: Number,
					default: 1, // Mặc định là 1
				},
				// ID sản phẩm - liên kết với model "Product"
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product", // Tham chiếu tới model "Product"
				},
			},
		],

		// Vai trò của người dùng - có thể là "customer" hoặc "admin", mặc định là "customer"
		role: {
			type: String,
			enum: ["customer", "admin"], // Chỉ có thể là "customer" hoặc "admin"
			default: "customer", // Mặc định là "customer"
		},
	},
	{
		timestamps: true, // Tự động thêm các trường "createdAt" và "updatedAt"
	}
);

// Hàm pre-save hook để mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
userSchema.pre("save", async function (next) {
	// Kiểm tra xem mật khẩu có bị thay đổi không, nếu không thì không cần mã hóa
	if (!this.isModified("password")) return next();

	try {
		// Tạo salt với độ dài 10
		const salt = await bcrypt.genSalt(10);
		// Mã hóa mật khẩu với salt đã tạo
		this.password = await bcrypt.hash(this.password, salt);
		next(); // Tiếp tục lưu người dùng
	} catch (error) {
		next(error); // Nếu có lỗi, chuyển tiếp lỗi
	}
});

// Phương thức so sánh mật khẩu trong cơ sở dữ liệu với mật khẩu người dùng nhập vào
userSchema.methods.comparePassword = async function (password) {
	// So sánh mật khẩu đã mã hóa trong cơ sở dữ liệu với mật khẩu người dùng nhập
	return bcrypt.compare(password, this.password);
};

// Tạo model User từ schema trên
const User = mongoose.model("User", userSchema);

// Xuất model để sử dụng ở các file khác
export default User;
