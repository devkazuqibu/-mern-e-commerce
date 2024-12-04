import express from "express";  // Import express để tạo router
import { login, logout, signup, refreshToken, getProfile,getAllUsers } from "../controller/auth.controller.js"; // Import các controller xử lý xác thực người dùng
import { protectRoute } from "../middleware/auth.middleware.js"; // Import middleware bảo vệ route

const router = express.Router();  // Tạo một router mới cho các route liên quan đến xác thực

// Route POST để đăng ký người dùng mới
router.post("/signup", signup);

// Route POST để đăng nhập người dùng
router.post("/login", login);

// Route POST để đăng xuất người dùng
router.post("/logout", logout);

// Route POST để làm mới token (refresh token)
router.post("/refresh-token", refreshToken);

// Route GET để lấy thông tin hồ sơ người dùng, yêu cầu phải có token hợp lệ
router.get("/profile", protectRoute, getProfile);
router.get("/users", protectRoute, getAllUsers);

export default router;  // Xuất router để sử dụng ở các file khác
