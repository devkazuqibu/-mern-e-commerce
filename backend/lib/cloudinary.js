// Import thư viện Cloudinary (version 2) để quản lý và xử lý media (ảnh, video)
import { v2 as cloudinary } from "cloudinary";

// Import dotenv để sử dụng biến môi trường từ file .env
import dotenv from "dotenv";

// Cấu hình dotenv để đọc các giá trị từ file .env
dotenv.config();

// Cấu hình Cloudinary với các thông tin xác thực
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Tên tài khoản Cloudinary
	api_key: process.env.CLOUDINARY_API_KEY,       // API key cho ứng dụng
	api_secret: process.env.CLOUDINARY_API_SECRET, // API secret để bảo mật
});

// Xuất module Cloudinary để sử dụng ở các phần khác của ứng dụng
export default cloudinary;
