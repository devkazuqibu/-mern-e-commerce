import { useEffect, useState } from "react"; 
import { useCartStore } from "../stores/useCartStore"; 
import axios from "../lib/axios"; 
import Confetti from "react-confetti"; 
import { CheckCircle, HandHeart, ArrowRight } from "lucide-react"; 
import { Link } from "react-router-dom"; 

const PurchaseSuccessPage = () => {
  const { clearCart } = useCartStore(); // Hook xóa giỏ hàng
  const [isProcessing, setIsProcessing] = useState(true); // Trạng thái xử lý thanh toán
  const [error, setError] = useState(null); // Trạng thái lỗi

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId) => {
      try {
        await axios.post("/payments/checkout-success", { sessionId }); // Xác nhận thanh toán
        clearCart(); // Xóa giỏ hàng sau khi thanh toán thành công
      } catch (error) {
        console.log(error); // Ghi lỗi nếu có
      } finally {
        setIsProcessing(false); // Đặt trạng thái xử lý thành công hoặc thất bại
      }
    };

    // Lấy sessionId từ URL và xử lý nếu có
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (sessionId) {
      handleCheckoutSuccess(sessionId); // Gọi hàm xử lý thanh toán nếu có sessionId
    } else {
      setIsProcessing(false); // Nếu không có sessionId, chỉ cần dừng xử lý
      setError("Không tìm thấy mã phiên giao dịch trong URL");
    }
  }, [clearCart]); // Hook chỉ chạy một lần, khi clearCart thay đổi

  // Trả về giao diện xử lý nếu đang trong quá trình xử lý
  if (isProcessing) return <div>Đang xử lý...</div>;

  // Hiển thị thông báo lỗi nếu có
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={700}
        recycle={false}
      />
      
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <CheckCircle className="text-emerald-400 w-16 h-16 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2">
            Mua hàng thành công!
          </h1>
          <p className="text-gray-300 text-center mb-2">
            Cảm ơn bạn đã đặt hàng. Chúng tôi đang xử lý đơn hàng của bạn.
          </p>
          <p className="text-emerald-400 text-center text-sm mb-6">
            Hãy kiểm tra email của bạn để nhận thông tin chi tiết và cập nhật về đơn hàng.
          </p>

          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Mã đơn hàng</span>
              <span className="text-sm font-semibold text-emerald-400">#38721</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Thời gian giao dự kiến</span>
              <span className="text-sm font-semibold text-emerald-400">3-5 ngày làm việc</span>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center">
              <HandHeart className="mr-2" size={18} />
              Cảm ơn bạn đã tin tưởng chúng tôi!
            </button>
            <Link
              to="/"
              className="w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            >
              Tiếp tục mua sắm
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
