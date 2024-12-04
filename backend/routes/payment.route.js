// Import thư viện express để tạo router
import express from "express";

// Import middleware bảo vệ route và các controller xử lý thanh toán
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkoutSuccess, createCheckoutSession } from "../controller/payment.controller.js";


// Tạo một router mới
const router = express.Router();

/**
 * Route tạo phiên thanh toán (checkout session)
 * - Phương thức POST
 * - Sử dụng middleware `protectRoute` để đảm bảo chỉ người dùng đã đăng nhập mới được phép truy cập
 * - Gọi hàm `createCheckoutSession` trong controller để xử lý logic
 */
router.post("/create-checkout-session", protectRoute, createCheckoutSession,);

/**
 * Route xử lý sau khi thanh toán thành công
 * - Phương thức POST
 * - Sử dụng middleware `protectRoute` để đảm bảo chỉ người dùng đã đăng nhập mới được phép truy cập
 * - Gọi hàm `checkoutSuccess` trong controller để xử lý logic
//  */
router.post("/checkout-success", protectRoute, checkoutSuccess);

// Xuất router để sử dụng trong các phần khác của ứng dụng
export default router;
