import Product from '../models/product.model.js'; // Import model Product từ file models

// Lấy danh sách sản phẩm trong giỏ hàng
export const getCartProducts = async (req, res) => {
	try {
		// Lấy danh sách sản phẩm từ database dựa trên danh sách ID trong giỏ hàng của người dùng
		const products = await Product.find({ _id: { $in: req.user.cartItems } });

		// Tính toán số lượng (quantity) cho từng sản phẩm trong giỏ hàng
		const cartItems = products.map((product) => {
			// Tìm sản phẩm tương ứng trong giỏ hàng của user
			const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
			// Kết hợp thông tin sản phẩm với số lượng
			return { ...product.toJSON(), quantity: item.quantity };
		});

		// Trả về danh sách sản phẩm trong giỏ hàng
		res.json(cartItems);
	} catch (error) {
		console.log("Lỗi trong hàm getCartProducts", error.message); // Ghi log lỗi
		res.status(500).json({ message: "Lỗi server", error: error.message }); // Phản hồi lỗi
	}
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body; // Lấy productId từ request body
		const user = req.user; // Lấy thông tin user từ request

		// Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
		const existingItem = user.cartItems.find((item) => item.id === productId);
		if (existingItem) {
			existingItem.quantity += 1; // Nếu đã có thì tăng số lượng
		} else {
			user.cartItems.push(productId); // Nếu chưa có thì thêm mới
		}

		// Lưu thay đổi vào database
		await user.save();
		res.json(user.cartItems); // Phản hồi danh sách giỏ hàng mới
	} catch (error) {
		console.log("Lỗi trong hàm addToCart", error.message); // Ghi log lỗi
		res.status(500).json({ message: "Lỗi server", error: error.message }); // Phản hồi lỗi
	}
};

// Xóa tất cả hoặc một sản phẩm cụ thể khỏi giỏ hàng
export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body; // Lấy productId từ request body
		const user = req.user; // Lấy thông tin user từ request
		if (!productId) {
			user.cartItems = []; // Nếu không có productId thì xóa toàn bộ giỏ hàng
		} else {
			// Nếu có productId, xóa sản phẩm đó khỏi giỏ hàng
			user.cartItems = user.cartItems.filter((item) => item.id !== productId);
		}
		await user.save(); // Lưu thay đổi vào database
		res.json(user.cartItems); // Phản hồi danh sách giỏ hàng mới
	} catch (error) {
		res.status(500).json({ message: "Lỗi server", error: error.message }); // Phản hồi lỗi
	}
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params; // Lấy productId từ params
		const { quantity } = req.body; // Lấy số lượng (quantity) từ request body
		const user = req.user; // Lấy thông tin user từ request
		const existingItem = user.cartItems.find((item) => item.id === productId); // Tìm sản phẩm trong giỏ hàng

		if (existingItem) {
			if (quantity === 0) {
				// Nếu số lượng bằng 0 thì xóa sản phẩm khỏi giỏ hàng
				user.cartItems = user.cartItems.filter((item) => item.id !== productId);
				await user.save(); // Lưu thay đổi vào database
				return res.json(user.cartItems); // Phản hồi danh sách giỏ hàng mới
			}

			// Nếu số lượng khác 0, cập nhật số lượng sản phẩm
			existingItem.quantity = quantity;
			await user.save(); // Lưu thay đổi vào database
			res.json(user.cartItems); // Phản hồi danh sách giỏ hàng mới
		} else {
			// Nếu không tìm thấy sản phẩm, trả về lỗi 404
			res.status(404).json({ message: "Không tìm thấy sản phẩm" });
		}
	} catch (error) {
		console.log("Lỗi trong hàm updateQuantity", error.message); // Ghi log lỗi
		res.status(500).json({ message: "Lỗi server", error: error.message }); // Phản hồi lỗi
	}
};
