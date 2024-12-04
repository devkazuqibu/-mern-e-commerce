// Import các thư viện cần thiết
import { create } from "zustand"; // Thư viện Zustand để quản lý trạng thái ứng dụng
import toast from "react-hot-toast"; // Thư viện để hiển thị thông báo (toast)
import axios from "../lib/axios"; // Cấu hình axios để thực hiện các yêu cầu HTTP

// Tạo store Zustand để quản lý trạng thái sản phẩm
export const useProductStore = create((set) => ({
  products: [], // Danh sách sản phẩm
  loading: false, // Trạng thái loading (đang tải)

  // Hàm setProducts: Cập nhật danh sách sản phẩm
  setProducts: (products) => set({ products }),

  // Hàm createProduct: Tạo sản phẩm mới
  createProduct: async (productData) => {
    set({ loading: true }); // Bật trạng thái loading
    try {
      const res = await axios.post("/products", productData); // Gửi yêu cầu POST để thêm sản phẩm mới
      set((prevState) => ({
        products: [...prevState.products, res.data], // Cập nhật danh sách sản phẩm
        loading: false, // Tắt trạng thái loading
      }));

      // Hiển thị thông báo thành công
      toast.success("Product added successfully!");
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có
      toast.error(error.response?.data?.error || "Failed to add product.");
      set({ loading: false });
    }
  },

  // Hàm fetchAllProducts: Lấy tất cả sản phẩm
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products"); // Gửi yêu cầu GET để lấy danh sách sản phẩm
      set({ products: response.data.products, loading: false }); // Cập nhật danh sách sản phẩm
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false }); // Xử lý lỗi
      toast.error(error.response.data.error || "Failed to fetch products"); // Hiển thị thông báo lỗi
    }
  },

  // Hàm fetchProductsByCategory: Lấy sản phẩm theo danh mục
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`); // Gửi yêu cầu GET theo danh mục
      set({ products: response.data.products, loading: false }); // Cập nhật danh sách sản phẩm
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },

  // Hàm deleteProduct: Xóa sản phẩm theo ID
  deleteProduct: async (productId, closeDialog) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`); // Gửi yêu cầu DELETE để xóa sản phẩm
      set((prevProducts) => ({
        products: prevProducts.products.filter((product) => product._id !== productId), // Loại bỏ sản phẩm đã xóa
        loading: false,
      }));
  
      // Hiển thị thông báo thành công
      toast.success("Product deleted successfully!");
  
      // Đóng dialog (modal)
      if (closeDialog) {
        closeDialog();
      }
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.error || "Failed to delete product"); // Hiển thị lỗi nếu có
    }
  },
  // Hàm toggleFeaturedProduct: Thay đổi trạng thái nổi bật của sản phẩm
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${productId}`); // Gửi yêu cầu PATCH để cập nhật sản phẩm
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
        ), // Cập nhật trạng thái nổi bật
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to update product"); // Hiển thị lỗi nếu có
    }
  },

  // Hàm fetchFeaturedProducts: Lấy các sản phẩm nổi bật
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/featured"); // Gửi yêu cầu GET để lấy sản phẩm nổi bật
      set({ products: response.data, loading: false }); // Cập nhật danh sách sản phẩm
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false }); // Xử lý lỗi
      console.log("Error fetching featured products:", error); // Ghi lỗi ra console
    }
  },

  // Hàm editProduct: Chỉnh sửa thông tin sản phẩm
  editProduct: async (productId, updatedProductData) => {
    set({ loading: true }); // Bật trạng thái loading
    try {
      const response = await axios.patch(`/products/${productId}`, updatedProductData); // Gửi yêu cầu PATCH để cập nhật sản phẩm
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === productId ? { ...product, ...response.data } : product
        ), // Cập nhật sản phẩm trong danh sách
        loading: false, // Tắt trạng thái loading
      }));
      toast.success("Product updated successfully!"); // Thông báo thành công
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.error || "Failed to update product"); // Thông báo lỗi nếu có
    }
  },
}));
