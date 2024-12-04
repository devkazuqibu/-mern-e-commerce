import { create } from "zustand"; // Thư viện Zustand để quản lý trạng thái
import axios from "../lib/axios"; // Thư viện Axios để gửi yêu cầu HTTP
import { toast } from "react-hot-toast"; // Thư viện Toast để hiển thị thông báo

// Store quản lý giỏ hàng
export const useCartStore = create((set, get) => ({
	// Trạng thái giỏ hàng, mã giảm giá, tổng tiền, v.v.
	cart: [], // Mảng các sản phẩm trong giỏ hàng
	coupon: null, // Mã giảm giá
	total: 0, // Tổng số tiền sau khi áp dụng mã giảm giá
	subtotal: 0, // Tổng tiền trước khi áp dụng mã giảm giá
	isCouponApplied: false, // Cờ cho biết mã giảm giá đã được áp dụng hay chưa

	// Lấy thông tin mã giảm giá từ server
	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons"); // Gửi yêu cầu lấy mã giảm giá
			set({ coupon: response.data }); // Lưu mã giảm giá vào store
		} catch (error) {
			console.error("Error fetching coupon:", error); // In lỗi nếu có
		}
	},

	// Áp dụng mã giảm giá
	applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupons/validate", { code }); // Gửi mã giảm giá để kiểm tra
			set({ coupon: response.data, isCouponApplied: true }); // Lưu thông tin mã giảm giá và cập nhật trạng thái
			get().calculateTotals(); // Tính lại tổng tiền sau khi áp dụng mã
			toast.success("Coupon applied successfully"); // Hiển thị thông báo thành công
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon"); // Hiển thị thông báo lỗi nếu có
		}
	},

	// Xóa mã giảm giá
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false }); // Xóa mã giảm giá và cập nhật lại trạng thái
		get().calculateTotals(); // Tính lại tổng tiền sau khi xóa mã
		toast.success("Coupon removed"); // Hiển thị thông báo mã giảm giá đã được xóa
	},

	// Lấy thông tin các sản phẩm trong giỏ hàng
	getCartItems: async () => {
		try {
			const res = await axios.get("/cart"); // Gửi yêu cầu lấy các sản phẩm trong giỏ
			set({ cart: res.data }); // Lưu danh sách sản phẩm vào store
			get().calculateTotals(); // Tính toán tổng tiền sau khi lấy sản phẩm
		} catch (error) {
			set({ cart: [] }); // Nếu có lỗi, xóa giỏ hàng
			toast.error(error.response.data.message || "An error occurred"); // Hiển thị thông báo lỗi
		}
	},

	// Xóa toàn bộ giỏ hàng


	// Thêm sản phẩm vào giỏ hàng
	addToCart: async (product) => {
		try {
			await axios.post("/cart", { productId: product._id }); // Gửi yêu cầu thêm sản phẩm vào giỏ
			toast.success("Product added to cart"); // Hiển thị thông báo thành công

			// Cập nhật giỏ hàng trong store
			set((prevState) => {
				const existingItem = prevState.cart.find((item) => item._id === product._id); // Kiểm tra nếu sản phẩm đã có trong giỏ
				const newCart = existingItem
					? prevState.cart.map((item) =>
							item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item // Tăng số lượng nếu sản phẩm đã có
					  )
					: [...prevState.cart, { ...product, quantity: 1 }]; // Thêm sản phẩm mới nếu chưa có
				return { cart: newCart }; // Cập nhật giỏ hàng
			});
			get().calculateTotals(); // Tính lại tổng tiền sau khi thêm sản phẩm
		} catch (error) {
			toast.error(error.response.data.message || "An error occurred"); // Hiển thị thông báo lỗi nếu có
		}
	},

	// Xóa sản phẩm khỏi giỏ hàng
	removeFromCart: async (productId) => {
		try {
			// Gửi yêu cầu xóa sản phẩm khỏi giỏ hàng
			await axios.delete(`/cart`, { data: { productId } });
			
			// Cập nhật giỏ hàng sau khi xóa sản phẩm
			set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
			
			// Tính lại tổng tiền sau khi xóa sản phẩm
			get().calculateTotals();
	
			// Hiển thị thông báo thành công (tiếng Việt)
			toast.success("Sản phẩm đã được xóa khỏi giỏ hàng thành công!", { id: "removeSuccess" });
		} catch (error) {
			// Hiển thị thông báo lỗi (tiếng Việt)
			toast.error("Xóa sản phẩm khỏi giỏ hàng không thành công. Vui lòng thử lại.", { id: "removeError" });
			console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error.message);
		}
	},

	// Cập nhật số lượng sản phẩm trong giỏ hàng
	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId); // Nếu số lượng bằng 0, xóa sản phẩm khỏi giỏ
			return;
		}

		await axios.put(`/cart/${productId}`, { quantity }); // Cập nhật số lượng sản phẩm trên server
		set((prevState) => ({
			cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)), // Cập nhật số lượng sản phẩm trong store
		}));
		get().calculateTotals(); // Tính lại tổng tiền sau khi cập nhật số lượng
	},

	// Tính toán tổng tiền và tổng trước khi áp dụng mã giảm giá
	calculateTotals: () => {
		const { cart, coupon } = get(); // Lấy giỏ hàng và mã giảm giá
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // Tính tổng tiền trước khi giảm giá
		let total = subtotal; // Khởi tạo tổng tiền là subtotal

		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100); // Tính số tiền giảm giá
			total = subtotal - discount; // Tính tổng tiền sau khi áp dụng giảm giá
		}

		set({ subtotal, total }); // Cập nhật subtotal và total vào store
	},
	clearCart: async () => {
		try {
		  await axios.delete("/cart"); // Gửi yêu cầu xóa giỏ hàng từ server
		  set({ cart: [], coupon: null, total: 0, subtotal: 0 }); // Xóa giỏ hàng trong Zustand
		} catch (error) {
		  console.error("Error clearing cart:", error);
		}
	  }
	  
}));
