// Import các thư viện cần thiết
import { create } from "zustand"; // Thư viện Zustand để quản lý trạng thái (state management)
import axios from "../lib/axios"; // Tự định nghĩa một instance của axios để xử lý HTTP request
import { toast } from "react-hot-toast"; // Thư viện để hiển thị thông báo (notification) kiểu "toast"

// Tạo một store sử dụng Zustand
export const useUserStore = create((set) => ({
  // Khởi tạo các state

  // user: null,          // Lưu thông tin người dùng hiện tại (null khi chưa đăng nhập)
  loading: false,      // Trạng thái đang tải (loading)
  checkingAuth: false, // Trạng thái kiểm tra xác thực (auth)
  users: [],

  fetchAllUsers: async () => {
    try {
      const response = await axios.get("/users"); // Không cần thêm /api ở đây
      set({ users: response.data }); // Cập nhật danh sách người dùng vào state
    } catch (error) {
      console.error("Failed to fetch users:", error.message);
    }
  },
  
  fetchUsersByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`); // Gửi yêu cầu GET theo danh mục
      set({ products: response.data.products, loading: false }); // Cập nhật danh sách sản phẩm
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },
  // Hàm đăng ký tài khoản
  signup: async ({ name, email, password, confirmPassword, phone, address }) => {
    set({ loading: true }); // Bật trạng thái loading

    // Kiểm tra nếu mật khẩu không khớp
    if (password !== confirmPassword) {
      set({ loading: false }); // Tắt trạng thái loading
      return toast.error("Passwords do not match"); // Hiển thị thông báo lỗi
    }

    try {
      // Gửi yêu cầu đăng ký tới API
      const res = await axios.post("/auth/signup", { name, email, password, phone, address });
      set({ user: res.data, loading: false }); // Lưu thông tin người dùng vào state và tắt loading
    } catch (error) {
      set({ loading: false }); // Tắt loading
      // Hiển thị thông báo lỗi từ API hoặc lỗi mặc định
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  // Hàm đăng nhập
  login: async (email, password) => {
    set({ loading: true }); // Bật trạng thái loading

    try {
      // Gửi yêu cầu đăng nhập tới API
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data, loading: false }); // Lưu thông tin người dùng vào state và tắt loading
    } catch (error) {
      set({ loading: false }); // Tắt loading
      // Hiển thị thông báo lỗi từ API hoặc lỗi mặc định
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  // Hàm đăng xuất
  logout: async () => {
    try {
      await axios.post("/auth/logout"); // Gửi yêu cầu đăng xuất tới API
      set({ user: null }); // Xóa thông tin người dùng trong state
    } catch (error) {
      // Hiển thị thông báo lỗi khi đăng xuất thất bại
      toast.error(error.response?.data?.message || "An error occurred during logout");
    }
  },

  // Hàm kiểm tra trạng thái xác thực người dùng
  checkAuth: async () => {
    set({ checkingAuth: true }); // Bật trạng thái kiểm tra xác thực
    try {
      // Gửi yêu cầu lấy thông tin người dùng hiện tại
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false }); // Lưu thông tin người dùng vào state
    } catch (error) {
      console.log(error.message); // Log lỗi ra console
      set({ checkingAuth: false, user: null }); // Tắt trạng thái kiểm tra và xóa thông tin người dùng
    }
  },
}));
