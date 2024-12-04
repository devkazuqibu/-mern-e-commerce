import express from "express";  // Import express để tạo router
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controller/cart.controller.js"; // Import các controller xử lý giỏ hàng
import { protectRoute } from "../middleware/auth.middleware.js"; // Import middleware bảo vệ route

const router = express.Router();  // Tạo một router mới cho các route liên quan đến giỏ hàng

// Route GET để lấy danh sách sản phẩm trong giỏ hàng, yêu cầu phải có token hợp lệ
router.get("/", protectRoute, getCartProducts);

// Route POST để thêm sản phẩm vào giỏ hàng, yêu cầu phải có token hợp lệ
router.post("/", protectRoute, addToCart);

// Route DELETE để xóa tất cả sản phẩm trong giỏ hàng, yêu cầu phải có token hợp lệ
router.delete("/", protectRoute, removeAllFromCart);

// Route PUT để cập nhật số lượng sản phẩm trong giỏ hàng, yêu cầu phải có token hợp lệ
router.put("/:id", protectRoute, updateQuantity);

export default router;  // Xuất router để sử dụng ở các file khác
