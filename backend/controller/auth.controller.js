// Import các thư viện cần thiết
import { redis } from "../lib/redis.js"; // Kết nối Redis để lưu trữ refresh token
import User from "../models/user.model.js"; // Model User để làm việc với dữ liệu người dùng
import jwt from "jsonwebtoken"; // Thư viện để tạo và xác minh JSON Web Token (JWT)





// Lấy danh sách tất cả người dùng (chỉ dành cho quản trị viên)
export const getAllUsers = async (req, res) => {
	try {
		const products = await Product.find({}); // Truy vấn toàn bộ sản phẩm từ MongoDB
		res.json({ products }); // Trả về danh sách sản phẩm
	  } catch (error) {
		console.error("Lỗi trong controller getAllProducts:", error.message);
		res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
	  }
  };
  
// Hàm tạo Access Token và Refresh Token
const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m", // Access Token hết hạn sau 15 phút
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d", // Refresh Token hết hạn sau 7 ngày
	});

	return { accessToken, refreshToken }; // Trả về cả hai token
};

// Hàm lưu Refresh Token vào Redis
const storeRefreshToken = async (userId, refreshToken) => {
	await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // Lưu token với thời hạn 7 ngày
};

// Hàm thiết lập cookie để lưu trữ token trên client
const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true, // Ngăn chặn tấn công XSS
		secure: process.env.NODE_ENV === "production", // Chỉ gửi qua HTTPS nếu ở chế độ production
		sameSite: "strict", // Ngăn chặn tấn công CSRF
		maxAge: 15 * 60 * 1000, // 15 phút
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true, // Ngăn chặn tấn công XSS
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
	});
};

// Đăng ký người dùng mới
export const signup = async (req, res) => {
	const { email, password, name ,phone, address} = req.body;
	try {
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}
		const user = await User.create({ name, email, password,phone, address });

		// Tạo token (accessToken và refreshToken) cho người dùng
		const { accessToken, refreshToken } = generateTokens(user._id);

		// Lưu Refresh Token vào Redis
		await storeRefreshToken(user._id, refreshToken);

		// Thiết lập cookie cho client (accessToken và refreshToken)
		setCookies(res, accessToken, refreshToken);

		// Trả về thông tin người dùng khi đăng ký thành công
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			phone: user.phone,
			address: user.address,
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

// Đăng nhập người dùng
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email }); // Tìm người dùng theo email

		if (user && (await user.comparePassword(password))) { // Kiểm tra mật khẩu
			const { accessToken, refreshToken } = generateTokens(user._id); // Tạo token
			await storeRefreshToken(user._id, refreshToken); // Lưu Refresh Token vào Redis
			setCookies(res, accessToken, refreshToken); // Thiết lập cookie

			res.json({ // Trả về thông tin người dùng
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			
			});
		} else {
			res.status(400).json({ message: "Invalid email or password" }); // Sai email hoặc mật khẩu
		}
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

// Đăng xuất người dùng
export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken; // Lấy Refresh Token từ cookie
		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET); // Giải mã Refresh Token
			await redis.del(`refresh_token:${decoded.userId}`); // Xóa Refresh Token khỏi Redis
		}

		res.clearCookie("accessToken"); // Xóa cookie Access Token
		res.clearCookie("refreshToken"); // Xóa cookie Refresh Token
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Tạo Access Token mới từ Refresh Token
export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" });
		}

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET); // Giải mã Refresh Token
		const storedToken = await redis.get(`refresh_token:${decoded.userId}`); // Lấy Refresh Token từ Redis

		if (storedToken !== refreshToken) {
			return res.status(401).json({ message: "Invalid refresh token" }); // Refresh Token không hợp lệ
		}

		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" }); // Tạo Access Token mới

		res.cookie("accessToken", accessToken, { // Lưu Access Token vào cookie
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000, // 15 phút
		});

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		console.log("Error in refreshToken controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Lấy thông tin hồ sơ người dùng (profile)
export const getProfile = async (req, res) => {
	try {
		res.json(req.user); // Trả về thông tin người dùng từ middleware xác thực
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
