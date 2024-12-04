import { XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Phần hiển thị thông báo huỷ đơn hàng với hiệu ứng chuyển động */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} // Khởi tạo với opacity 0 và di chuyển từ dưới lên
        animate={{ opacity: 1, y: 0 }} // Kết thúc với opacity 1 và vị trí ban đầu
        transition={{ duration: 0.5 }} // Thời gian chuyển động là 0.5 giây
        className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10"
      >
        {/* Nội dung của hộp thông báo huỷ đơn hàng */}
        <div className="p-6 sm:p-8">
          {/* Biểu tượng huỷ đơn hàng */}
          <div className="flex justify-center">
            <XCircle className="text-red-500 w-16 h-16 mb-4" />
          </div>
          {/* Tiêu đề thông báo huỷ đơn hàng */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-red-500 mb-2">
            Đơn Hàng Đã Bị Hủy
          </h1>
          {/* Mô tả thông báo huỷ đơn hàng */}
          <p className="text-gray-300 text-center mb-6">
            Đơn hàng của bạn đã bị hủy. Không có bất kỳ khoản thanh toán nào được thực hiện.
          </p>
          {/* Thông báo hỗ trợ khách hàng */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400 text-center">
              Nếu bạn gặp phải bất kỳ vấn đề gì trong quá trình thanh toán, xin đừng ngần ngại liên hệ
              với đội ngũ hỗ trợ của chúng tôi.
            </p>
          </div>
          {/* Nút quay lại trang mua sắm */}
          <div className="space-y-4">
            <Link
              to={"/"} // Chuyển đến trang chủ hoặc trang mua sắm
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <ArrowLeft className="mr-2" size={18} /> {/* Biểu tượng mũi tên */}
              Quay lại cửa hàng
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseCancelPage;
