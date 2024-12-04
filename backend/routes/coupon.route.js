// Import các module và thư viện cần thiết
import express from "express"; // Framework để tạo server và quản lý routing
import { protectRoute } from "../middleware/auth.middleware.js"; // Middleware để kiểm tra xác thực người dùng
import { getCoupon, validateCoupon } from "../controller/coupon.controller.js"; 
// Import các hàm xử lý logic liên quan đến mã giảm giá từ controller

// Khởi tạo router mới từ Express
const router = express.Router();

// Định nghĩa các route (đường dẫn API) liên quan đến mã giảm giá

// Lấy danh sách mã giảm giá (chỉ áp dụng cho người dùng đã đăng nhập)
router.get("/", protectRoute, getCoupon);

// Kiểm tra và xác thực tính hợp lệ của mã giảm giá (chỉ áp dụng cho người dùng đã đăng nhập)
router.post("/validate", protectRoute, validateCoupon);

// Xuất router để sử dụng trong file chính hoặc các module khác
export default router;
