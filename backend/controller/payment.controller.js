import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";

// Tạo một session thanh toán mới với Stripe
export const createCheckoutSession = async (req, res) => {
	try {
		// Lấy danh sách sản phẩm và mã giảm giá từ yêu cầu
		const { products, couponCode } = req.body;

		// Kiểm tra danh sách sản phẩm có hợp lệ không
		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		// Tạo danh sách line items (sản phẩm) cho Stripe
		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100); // Chuyển đổi giá về đơn vị cents
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: [product.image], // Hình ảnh sản phẩm
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1, // Mặc định số lượng là 1 nếu không có
			};
		});

		let coupon = null;
		// Kiểm tra mã giảm giá (nếu có)
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				// Áp dụng giảm giá nếu mã hợp lệ
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		// Tạo một phiên thanh toán trên Stripe
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"], // Chỉ hỗ trợ thanh toán bằng thẻ
			line_items: lineItems, // Danh sách sản phẩm
			mode: "payment", // Chế độ thanh toán
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`, // URL khi thanh toán thành công
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`, // URL khi hủy thanh toán
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discountPercentage), // Tạo mã giảm giá trên Stripe
						},
				  ]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		// Nếu tổng giá trị đơn hàng >= 20000, tạo mã giảm giá mới cho khách hàng
		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}

		// Trả về thông tin phiên thanh toán
		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

// Xử lý sau khi thanh toán thành công
export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		// Kiểm tra trạng thái thanh toán
		if (session.payment_status === "paid") {
			if (session.metadata.couponCode) {
				// Hủy kích hoạt mã giảm giá đã sử dụng
				await Coupon.findOneAndUpdate(
					{
						code: session.metadata.couponCode,
						userId: session.metadata.userId,
					},
					{
						isActive: false,
					}
				);
			}

			// Tạo đơn hàng mới
			const products = JSON.parse(session.metadata.products);
			const newOrder = new Order({
				user: session.metadata.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: session.amount_total / 100, // Chuyển đổi từ cents sang đô la
				stripeSessionId: sessionId,
			});

			await newOrder.save();

			// Trả về phản hồi sau khi xử lý thành công
			res.status(200).json({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used.",
				orderId: newOrder._id,
			});
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

// Hàm tạo mã giảm giá trên Stripe
async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});

	return coupon.id;
}

// Hàm tạo mã giảm giá mới
async function createNewCoupon(userId) {
	// Xóa mã giảm giá cũ của người dùng (nếu có)
	await Coupon.findOneAndDelete({ userId });

	// Tạo mã giảm giá mới
	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 15, // Giảm giá 10%
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Hạn sử dụng 30 ngày
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}
