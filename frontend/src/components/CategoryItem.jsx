import { Link } from "react-router-dom"; // Nhập Link từ react-router-dom để sử dụng điều hướng trang

// Thành phần hiển thị mỗi mục danh mục
const CategoryItem = ({ category }) => {
	return (
		<div className='relative overflow-hidden h-96 w-full rounded-lg group'> {/* Định dạng bao bọc cho mỗi mục danh mục */}
			<Link to={"/category" + category.href}> {/* Liên kết đến trang danh mục khi người dùng click vào */}
				<div className='w-full h-full cursor-pointer'>
					{/* Lớp phủ gradient mờ trên ảnh */}
					<div className='absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10' />
					{/* Ảnh danh mục, có hiệu ứng chuyển động khi hover */}
					<img
						src={category.imageUrl} // Đường dẫn ảnh từ dữ liệu danh mục
						alt={category.name} // Thông tin mô tả ảnh
						className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110' // Cấu hình hiệu ứng zoom khi hover
						loading='lazy' // Tải ảnh chậm (lazy loading)
					/>
					{/* Thông tin hiển thị trên ảnh */}
					<div className='absolute bottom-0 left-0 right-0 p-4 z-20'>
						<h3 className='text-white text-2xl font-bold mb-2'>{category.name}</h3> {/* Tên danh mục */}
						<p className='text-gray-200 text-sm'>Explore {category.name}</p> {/* Mô tả ngắn về danh mục */}
					</div>
				</div>
			</Link>
		</div>
	);
};

export default CategoryItem; // Xuất thành phần CategoryItem để sử dụng ở nơi khác
