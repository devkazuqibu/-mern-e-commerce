import { Minus, Plus, Trash } from "lucide-react"; // Import các biểu tượng từ thư viện Lucide React
import { useCartStore } from "../stores/useCartStore"; // Import hook để truy cập trạng thái và hành động của giỏ hàng

// Thành phần hiển thị một mục trong giỏ hàng
const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore(); // Lấy hàm để xóa và cập nhật số lượng sản phẩm từ trạng thái giỏ hàng

	return (
		<div className='rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:p-6'>
			{/* Bố cục sản phẩm trong giỏ hàng */}
			<div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
				{/* Hình ảnh sản phẩm */}
				<div className='shrink-0 md:order-1'>
					<img
						className='h-20 md:h-32 rounded object-cover' // Định dạng hình ảnh
						src={item.image} // Đường dẫn hình ảnh
						alt={`Image of ${item.name}`} // Văn bản thay thế
					/>
				</div>

				{/* Nhãn ẩn chỉ dành cho trình đọc màn hình */}
				<label className='sr-only'>Chọn số lượng:</label>

				{/* Phần chọn số lượng và hiển thị giá */}
				<div className='flex items-center justify-between md:order-3 md:justify-end'>
					{/* Nút giảm số lượng */}
					<div className='flex items-center gap-2'>
						<button
							className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
							 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2
							  focus:ring-emerald-500'
							onClick={() => updateQuantity(item._id, item.quantity - 1)} // Giảm số lượng
						>
							<Minus className='text-gray-300' /> {/* Biểu tượng trừ */}
						</button>
						{/* Hiển thị số lượng hiện tại */}
						<p>{item.quantity}</p>
						{/* Nút tăng số lượng */}
						<button
							className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
							 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none 
						focus:ring-2 focus:ring-emerald-500'
							onClick={() => updateQuantity(item._id, item.quantity + 1)} // Tăng số lượng
						>
							<Plus className='text-gray-300' /> {/* Biểu tượng cộng */}
						</button>
					</div>

					{/* Hiển thị giá sản phẩm */}
					<div className='text-end md:order-4 md:w-32'>
						<p className='text-base font-bold text-emerald-400'>${item.price}</p> {/* Giá sản phẩm */}
					</div>
				</div>

				{/* Thông tin mô tả sản phẩm */}
				<div className='w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md'>
					{/* Tên sản phẩm */}
					<p className='text-base font-medium text-white hover:text-emerald-400 hover:underline'>
						{item.name} {/* Tên sản phẩm */}
					</p>
					{/* Mô tả sản phẩm */}
					<p className='text-sm text-gray-400'>{item.description}</p> {/* Mô tả sản phẩm */}

					{/* Nút xóa sản phẩm */}
					<div className='flex items-center gap-4'>
						<button
							className='inline-flex items-center text-sm font-medium text-red-400
							 hover:text-red-300 hover:underline'
							onClick={() => removeFromCart(item._id)} // Xóa sản phẩm khỏi giỏ hàng
						>
							<Trash /> {/* Biểu tượng thùng rác */}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartItem; // Xuất thành phần để sử dụng ở nơi khác
