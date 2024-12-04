import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

// Lấy dữ liệu tổng quan về người dùng, sản phẩm, doanh số, doanh thu
export const getAnalyticsData = async () => {
	const totalUsers = await User.countDocuments(); // Tổng số người dùng
	const totalProducts = await Product.countDocuments(); // Tổng số sản phẩm

	const salesData = await Order.aggregate([
		{
			$group: {
				_id: null, // Gom tất cả đơn hàng
				totalSales: { $sum: 1 }, // Tổng số đơn hàng
				totalRevenue: { $sum: "$totalAmount" }, // Tổng doanh thu
			},
		},
	]);

	const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 }; // Xử lý khi không có dữ liệu

	return { users: totalUsers, products: totalProducts, totalSales, totalRevenue }; // Trả về dữ liệu tổng quan
};

// Lấy dữ liệu doanh thu hàng ngày
export const getDailySalesData = async (startDate, endDate) => {
	try {
		const dailySalesData = await Order.aggregate([
			{
				$match: { createdAt: { $gte: startDate, $lte: endDate } }, // Lọc theo khoảng thời gian
			},
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Nhóm theo ngày
					sales: { $sum: 1 }, // Số đơn hàng mỗi ngày
					revenue: { $sum: "$totalAmount" }, // Tổng doanh thu mỗi ngày
				},
			},
			{ $sort: { _id: 1 } }, // Sắp xếp theo ngày
		]);

		const dateArray = getDatesInRange(startDate, endDate); // Tạo danh sách tất cả các ngày trong khoảng
		return dateArray.map((date) => {
			const foundData = dailySalesData.find((item) => item._id === date); // Tìm dữ liệu theo ngày
			return { date, sales: foundData?.sales || 0, revenue: foundData?.revenue || 0 }; // Gán mặc định nếu không có dữ liệu
		});
	} catch (error) {
		throw error; // Ném lỗi nếu có
	}
};

// Hàm tạo danh sách ngày trong khoảng thời gian
function getDatesInRange(startDate, endDate) {
	const dates = [];
	let currentDate = new Date(startDate);
	while (currentDate <= endDate) {
		dates.push(currentDate.toISOString().split("T")[0]); // Lấy ngày theo định dạng `YYYY-MM-DD`
		currentDate.setDate(currentDate.getDate() + 1); // Tăng ngày thêm 1
	}
	return dates; // Trả về danh sách ngày
}
