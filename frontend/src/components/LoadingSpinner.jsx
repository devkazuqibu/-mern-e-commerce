const LoadingSpinner = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-900"> {/* Trung tâm màn hình, nền đen tối */}
			<div className="relative"> {/* Đặt spinner trong một vị trí tương đối */}
				{/* Vòng tròn bên ngoài, tạo khung cho spinner */}
				<div className="w-20 h-20 border-emerald-200 border-2 rounded-full" />
				
				{/* Vòng tròn quay, sử dụng border-top để tạo hiệu ứng quay */}
				<div className="w-20 h-20 border-emerald-500 border-t-2 animate-spin rounded-full absolute left-0 top-0" />
				
				{/* Phần tử này chỉ dành cho screen reader, để thông báo là đang tải */}
				<div className="sr-only">Loading</div>
			</div>
		</div>
	);
};

export default LoadingSpinner; // Xuất component LoadingSpinner để sử dụng ở nơi khác
