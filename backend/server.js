// Import các module và thư viện cần thiết
import express from "express"; // Framework để xây dựng server
import dotenv from "dotenv"; // Quản lý biến môi trường (env)
import cookieParser from "cookie-parser"; // Xử lý cookie trong request
import path from "path"; // Xử lý đường dẫn file trong hệ thống

// Import các route (các module xử lý logic cho từng nhóm API)
import authRoutes from "./routes/auth.route.js"; // Route cho xác thực (authentication)
import productRoutes from "./routes/product.route.js"; // Route cho sản phẩm
import cartRoutes from "./routes/cart.route.js"; // Route cho giỏ hàng
import couponRoutes from "./routes/coupon.route.js"; // Route cho mã giảm giá
import paymentRoutes from "./routes/payment.route.js"; // Route cho thanh toán
import analyticsRoutes from "./routes/analytics.route.js"; // Route cho phân tích dữ liệu

// Import hàm kết nối cơ sở dữ liệu
import { connectDB } from "./lib/db.js";

// Cấu hình biến môi trường từ file .env
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 5001; // Lấy PORT từ biến môi trường hoặc mặc định là 5001

// Xác định thư mục gốc của dự án
const __dirname = path.resolve();

// Middleware để phân tích nội dung request
app.use(express.json({ limit: "10mb" })); // Phân tích body của request (giới hạn 10MB)
app.use(cookieParser()); // Phân tích cookie trong request

// Định nghĩa các endpoint API và ánh xạ chúng tới các route
app.use("/api/auth", authRoutes); // Endpoint cho xác thực người dùng
app.use("/api/products", productRoutes); // Endpoint cho quản lý sản phẩm
app.use("/api/cart", cartRoutes); // Endpoint cho quản lý giỏ hàng
app.use("/api/coupons", couponRoutes); // Endpoint cho mã giảm giá
app.use("/api/payments", paymentRoutes); // Endpoint cho thanh toán
app.use("/api/analytics", analyticsRoutes); // Endpoint cho phân tích dữ liệu

// Cấu hình khi ứng dụng chạy ở chế độ production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist"))); // Cung cấp file tĩnh từ thư mục frontend/dist

	// Bắt tất cả các route khác và trả về file index.html (Single Page Application)
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// Lắng nghe server trên cổng đã định nghĩa
app.listen(PORT, () => {
	console.log("Server is running on http://localhost:" + PORT); // Thông báo server đã chạy
	connectDB(); // Kết nối cơ sở dữ liệu
});
