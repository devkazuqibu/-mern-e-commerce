import express from "express";  // Import express để tạo router
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js"; // Import middleware để bảo vệ route
import { getAnalyticsData, getDailySalesData } from "../controller/analytics.controller.js"; // Import controller để xử lý dữ liệu

const router = express.Router(); // Tạo một router mới cho các route liên quan đến analytics

// Định nghĩa route GET cho đường dẫn "/"
router.get("/", protectRoute, adminRoute, async (req, res) => {
	try {
		// Lấy dữ liệu analytics từ controller
		const analyticsData = await getAnalyticsData();

		// Tạo ngày kết thúc là ngày hiện tại
		const endDate = new Date();
		// Tạo ngày bắt đầu là 7 ngày trước ngày hiện tại
		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

		// Lấy dữ liệu doanh thu theo ngày từ controller, với khoảng thời gian từ startDate đến endDate
		const dailySalesData = await getDailySalesData(startDate, endDate);

		// Trả về dữ liệu analytics và doanh thu theo ngày
		res.json({
			analyticsData,
			dailySalesData,
		});
	} catch (error) {
		// Nếu có lỗi, log lỗi và trả về thông báo lỗi với mã trạng thái 500
		console.log("Error in analytics route", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

export default router;  // Xuất router để sử dụng ở các file khác
