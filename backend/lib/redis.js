import Redis from "ioredis"; // Import thư viện ioredis để làm việc với Redis
import dotenv from "dotenv"; // Import thư viện dotenv để đọc các biến môi trường từ file .env

dotenv.config(); // Đọc và nạp các biến môi trường từ file .env vào process.env

// Khởi tạo kết nối tới Redis bằng URL được lưu trữ trong biến môi trường UPSTASH_REDIS_URL
export const redis = new Redis(process.env.UPSTASH_REDIS_URL);
