import mongoose from "mongoose"; // Import mongoose để sử dụng các tính năng kết nối MongoDB

// Hàm kết nối tới MongoDB
export const connectDB = async () => {
	try {
		// Thực hiện kết nối với MongoDB thông qua URI (địa chỉ kết nối) được lưu trong biến môi trường MONGO_URI
		const conn = await mongoose.connect(process.env.MONGO_URI);
		
		// Nếu kết nối thành công, in ra thông báo kết nối và tên máy chủ của cơ sở dữ liệu
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		// Nếu kết nối thất bại, in ra lỗi và kết thúc quá trình (dừng server) với mã lỗi 1
		console.log("Error connecting to MONGODB", error.message);
		process.exit(1); // Dừng chương trình khi không thể kết nối
	}
};
