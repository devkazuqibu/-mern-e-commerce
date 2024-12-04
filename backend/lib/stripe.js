// Import thư viện Stripe để tích hợp thanh toán
import Stripe from "stripe";

// Import dotenv để sử dụng biến môi trường từ file .env
import dotenv from "dotenv";

// Cấu hình dotenv để đọc dữ liệu từ file .env
dotenv.config();

// Khởi tạo một instance của Stripe với khóa bí mật (secret key)
// Khóa bí mật được lưu trong biến môi trường để bảo mật
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
