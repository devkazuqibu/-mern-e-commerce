import { motion } from "framer-motion"; // Nhập thư viện Framer Motion để sử dụng các hiệu ứng hoạt hình (animation)
import { useEffect, useState } from "react"; // Nhập các hook từ React: useEffect (vòng đời component) và useState (quản lý trạng thái)
import axios from "../lib/axios"; // Nhập axios để thực hiện các yêu cầu HTTP
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react"; // Nhập các icon từ thư viện lucide-react
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"; // Nhập các thành phần từ Recharts để vẽ biểu đồ

// Thành phần chính của tab phân tích
const AnalyticsTab = () => {
	const [analyticsData, setAnalyticsData] = useState({
		users: 0, // Số lượng người dùng
		products: 0, // Số lượng sản phẩm
		totalSales: 0, // Tổng số đơn hàng
		totalRevenue: 0, // Tổng doanh thu
	});
	const [isLoading, setIsLoading] = useState(true); // Trạng thái đang tải dữ liệu
	const [dailySalesData, setDailySalesData] = useState([]); // Dữ liệu doanh thu hàng ngày

	// Lấy dữ liệu phân tích khi component được render lần đầu
	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				const response = await axios.get("/analytics"); // Gửi yêu cầu HTTP để lấy dữ liệu phân tích
				setAnalyticsData(response.data.analyticsData); // Lưu dữ liệu phân tích vào state
				setDailySalesData(response.data.dailySalesData); // Lưu dữ liệu doanh thu hàng ngày vào state
			} catch (error) {
				console.error("Error fetching analytics data:", error); // Xử lý lỗi nếu có
			} finally {
				setIsLoading(false); // Đặt trạng thái đang tải thành false sau khi hoàn tất
			}
		};

		fetchAnalyticsData(); // Gọi hàm lấy dữ liệu
	}, []); // useEffect sẽ chỉ chạy một lần khi component được render lần đầu

	// Nếu dữ liệu chưa tải xong, hiển thị thông báo "Loading..."
	if (isLoading) {
		return <div>Loading...</div>;
	}

	// Giao diện hiển thị thông tin phân tích
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
				{/* Các thẻ phân tích hiển thị thông tin người dùng, sản phẩm, đơn hàng và doanh thu */}
				<AnalyticsCard
					title='Total Users' // Tiêu đề
					value={analyticsData.users.toLocaleString()} // Giá trị hiển thị
					icon={Users} // Icon đại diện
					color='from-emerald-500 to-teal-700' // Màu sắc của thẻ
				/>
				<AnalyticsCard
					title='Total Products'
					value={analyticsData.products.toLocaleString()}
					icon={Package}
					color='from-emerald-500 to-green-700'
				/>
				<AnalyticsCard
					title='Total Sales'
					value={analyticsData.totalSales.toLocaleString()}
					icon={ShoppingCart}
					color='from-emerald-500 to-cyan-700'
				/>
				<AnalyticsCard
					title='Total Revenue'
					value={`$${analyticsData.totalRevenue.toLocaleString()}`} // Định dạng tiền tệ
					icon={DollarSign}
					color='from-emerald-500 to-lime-700'
				/>
			</div>

			{/* Biểu đồ doanh thu hàng ngày */}
			<motion.div
				className='bg-gray-800/60 rounded-lg p-6 shadow-lg'
				initial={{ opacity: 0, y: 20 }} // Animation ban đầu: mờ và di chuyển từ dưới lên
				animate={{ opacity: 1, y: 0 }} // Animation kết thúc: hiển thị và ở vị trí ban đầu
				transition={{ duration: 0.5, delay: 0.25 }} // Thời gian và độ trễ của hiệu ứng
			>
				<ResponsiveContainer width='100%' height={400}>
					<LineChart data={dailySalesData}> {/* Biểu đồ đường thể hiện doanh thu và đơn hàng */}
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='name' stroke='#D1D5DB' />
						<YAxis yAxisId='left' stroke='#D1D5DB' />
						<YAxis yAxisId='right' orientation='right' stroke='#D1D5DB' />
						<Tooltip />
						<Legend />
						<Line
							yAxisId='left'
							type='monotone'
							dataKey='sales' // Hiển thị doanh số bán hàng
							stroke='#10B981'
							activeDot={{ r: 8 }}
							name='Sales'
						/>
						<Line
							yAxisId='right'
							type='monotone'
							dataKey='revenue' // Hiển thị doanh thu
							stroke='#3B82F6'
							activeDot={{ r: 8 }}
							name='Revenue'
						/>
					</LineChart>
				</ResponsiveContainer>
			</motion.div>
		</div>
	);
};
export default AnalyticsTab; // Xuất thành phần để sử dụng ở nơi khác

// Thành phần thẻ phân tích
const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
	<motion.div
		className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`} // Kiểu dáng của thẻ
		initial={{ opacity: 0, y: 20 }} // Animation ban đầu
		animate={{ opacity: 1, y: 0 }} // Animation kết thúc
		transition={{ duration: 0.5 }} // Thời gian của hiệu ứng
	>
		<div className='flex justify-between items-center'>
			<div className='z-10'>
				<p className='text-emerald-300 text-sm mb-1 font-semibold'>{title}</p> {/* Tiêu đề */}
				<h3 className='text-white text-3xl font-bold'>{value}</h3> {/* Giá trị */}
			</div>
		</div>
		{/* Lớp nền với hiệu ứng gradient */}
		<div className='absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30' />
		{/* Icon trong góc thẻ */}
		<div className='absolute -bottom-4 -right-4 text-emerald-800 opacity-50'>
			<Icon className='h-32 w-32' />
		</div>
	</motion.div>
);
