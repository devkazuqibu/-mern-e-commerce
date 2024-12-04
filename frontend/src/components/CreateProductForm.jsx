import { useState } from "react"; // Nhập hook useState từ React để quản lý state
import { motion } from "framer-motion"; // Nhập motion từ framer-motion để thêm hiệu ứng animation
import { PlusCircle, Upload, Loader } from "lucide-react"; // Nhập các biểu tượng cần sử dụng
import { useProductStore } from "../stores/useProductStore"; // Nhập hook quản lý sản phẩm

// Các danh mục sản phẩm có sẵn
const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

// Thành phần tạo sản phẩm mới
const CreateProductForm = () => {
	// State để lưu thông tin sản phẩm mới
	const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		image: "",
	});

	// Lấy các hàm từ useProductStore
	const { createProduct, loading } = useProductStore();

	// Xử lý sự kiện khi người dùng gửi form
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// Gọi hàm createProduct để thêm sản phẩm mới
			await createProduct(newProduct);
			// Reset lại thông tin sản phẩm
			setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
		} catch {
			console.log("error creating a product"); // Log lỗi nếu có
		}
	};

	// Xử lý thay đổi hình ảnh khi người dùng tải lên ảnh mới
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			// Khi đọc xong file, cập nhật state sản phẩm với hình ảnh
			reader.onloadend = () => {
				setNewProduct({ ...newProduct, image: reader.result });
			};

			reader.readAsDataURL(file); // Đọc file ảnh dưới dạng base64
		}
	};

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto' // Thiết lập giao diện cho form
			initial={{ opacity: 0, y: 20 }} // Thiết lập trạng thái ban đầu của animation
			animate={{ opacity: 1, y: 0 }} // Thiết lập trạng thái khi animation hoàn thành
			transition={{ duration: 0.8 }} // Thời gian chuyển động của animation
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Product</h2>

			<form onSubmit={handleSubmit} className='space-y-4'>
				{/* Ô nhập tên sản phẩm */}
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
						Product Name
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
				</div>

				{/* Ô nhập mô tả sản phẩm */}
				<div>
					<label htmlFor='description' className='block text-sm font-medium text-gray-300'>
						Description
					</label>
					<textarea
						id='description'
						name='description'
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='3'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500'
						required
					/>
				</div>

				{/* Ô nhập giá sản phẩm */}
				<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
						Price
					</label>
					<input
						type='number'
						id='price'
						name='price'
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						step='0.01'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
						required
					/>
				</div>

				{/* Ô chọn danh mục sản phẩm */}
				<div>
					<label htmlFor='category' className='block text-sm font-medium text-gray-300'>
						Category
					</label>
					<select
						id='category'
						name='category'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						required
					>
						<option value=''>Select a category</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</div>

				{/* Ô tải lên hình ảnh sản phẩm */}
				<div className='mt-1 flex items-center'>
					<input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
					<label
						htmlFor='image'
						className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
					>
						<Upload className='h-5 w-5 inline-block mr-2' />
						Upload Image
					</label>
					{newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>}
				</div>

				{/* Nút gửi form */}
				<button
					type='submit'
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
					disabled={loading} // Vô hiệu nút khi đang tải
				>
					{/* Nếu đang tải, hiển thị biểu tượng loading */}
					{loading ? (
						<>
							<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
							Loading...
						</>
					) : (
						<>
							<PlusCircle className='mr-2 h-5 w-5' />
							Create Product
						</>
					)}
				</button>
			</form>
		</motion.div>
	);
};
export default CreateProductForm; // Xuất thành phần CreateProductForm để sử dụng ở nơi khác
