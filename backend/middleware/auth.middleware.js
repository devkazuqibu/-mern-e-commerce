import jwt from "jsonwebtoken"; // Import thư viện jwt để giải mã token
import User from "../models/user.model.js"; // Import model người dùng

// Middleware bảo vệ route, kiểm tra token và xác thực người dùng
export const protectRoute = async (req, res, next) => {
	try {
		// Lấy access token từ cookie
		const accessToken = req.cookies.accessToken;

		// Nếu không có access token, trả về lỗi 401 (Unauthorized)
		if (!accessToken) {
			return res.status(401).json({ message: "Unauthorized - No access token provided" });
		}

		try {
			// Giải mã access token và xác thực token bằng secret key
			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
			// Tìm người dùng trong cơ sở dữ liệu dựa trên userId được giải mã từ token
			const user = await User.findById(decoded.userId).select("-password");

			// Nếu không tìm thấy người dùng, trả về lỗi 401 (Unauthorized)
			if (!user) {
				return res.status(401).json({ message: "User not found" });
			}

			// Gán đối tượng người dùng vào req.user để sử dụng trong các middleware sau
			req.user = user;

			// Tiếp tục xử lý request
			next();
		} catch (error) {
			// Nếu token hết hạn, trả về lỗi 401 (Unauthorized)
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Unauthorized - Access token expired" });
			}
			// Nếu có lỗi khác trong quá trình giải mã token, ném lỗi
			throw error;
		}
	} catch (error) {
		// Nếu có bất kỳ lỗi nào trong quá trình xử lý, trả về lỗi 401 (Unauthorized)
		console.log("Error in protectRoute middleware", error.message);
		return res.status(401).json({ message: "Unauthorized - Invalid access token" });
	}
};

// Middleware kiểm tra quyền truy cập admin
export const adminRoute = (req, res, next) => {
	// Kiểm tra nếu người dùng có vai trò admin
	if (req.user && req.user.role === "admin") {
		// Nếu là admin, tiếp tục xử lý request
		next();
	} else {
		// Nếu không phải admin, trả về lỗi 403 (Forbidden)
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
};
