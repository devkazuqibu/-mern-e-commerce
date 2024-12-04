import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

// Lấy danh sách tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // Truy vấn toàn bộ sản phẩm từ MongoDB
    res.json({ products }); // Trả về danh sách sản phẩm
  } catch (error) {
    console.error("Lỗi trong controller getAllProducts:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Lấy danh sách sản phẩm nổi bật
export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products"); // Kiểm tra cache Redis
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts)); // Trả về cache nếu tồn tại
    }

    featuredProducts = await Product.find({ isFeatured: true }).lean(); // Truy vấn sản phẩm nổi bật từ MongoDB
    if (!featuredProducts || featuredProducts.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm nổi bật" });
    }

    await redis.set("featured_products", JSON.stringify(featuredProducts)); // Lưu kết quả vào Redis
    res.json(featuredProducts); // Trả về danh sách sản phẩm nổi bật
  } catch (error) {
    console.error("Lỗi trong controller getFeaturedProducts:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Tạo mới một sản phẩm
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category} = req.body;

    if (!name || !description || !price || !category ) {
      return res.status(400).json({ message: "Thiếu thông tin sản phẩm" }); // Kiểm tra dữ liệu đầu vào
    }

    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" }); // Upload ảnh lên Cloudinary
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url || "", // Lưu URL ảnh nếu có
      category,
    
    });

    res.status(201).json(product); // Trả về sản phẩm vừa tạo
  } catch (error) {
    console.error("Lỗi trong controller createProduct:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
// Đổi thông tin sản phẩm
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description, image } = req.body;

    // Logic cập nhật sản phẩm
    const product = await Product.findByIdAndUpdate(id, {
      name, price, category, description, image
    }, { new: true });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Xóa một sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Tìm sản phẩm theo ID

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" }); // Kiểm tra nếu không tìm thấy
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0]; // Lấy publicId của ảnh trên Cloudinary
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`); // Xóa ảnh khỏi Cloudinary
      } catch (error) {
        console.error("Lỗi khi xóa ảnh từ Cloudinary:", error);
      }
    }

    await Product.findByIdAndDelete(req.params.id); // Xóa sản phẩm khỏi MongoDB
    res.json({ message: "Xóa sản phẩm thành công" }); // Trả về phản hồi thành công
  } catch (error) {
    console.error("Lỗi trong controller deleteProduct:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Lấy danh sách sản phẩm gợi ý (ngẫu nhiên)
export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 4 } }, // Lấy ngẫu nhiên 4 sản phẩm
      { $project: { _id: 1, name: 1, description: 1, image: 1, price: 1 } }, // Chỉ lấy các trường cần thiết
    ]);
    res.json(products); // Trả về danh sách sản phẩm
  } catch (error) {
    console.error("Lỗi trong controller getRecommendedProducts:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Lấy sản phẩm theo danh mục
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    if (!category) {
      return res.status(400).json({ message: "Danh mục không hợp lệ" }); // Kiểm tra dữ liệu đầu vào
    }

    const products = await Product.find({ category }); // Tìm sản phẩm theo danh mục
    if (!products || products.length === 0) {
      return res.status(404).json({ message: `Không có sản phẩm trong danh mục: ${category}` });
    }

    res.json({ products }); // Trả về danh sách sản phẩm
  } catch (error) {
    console.error("Lỗi trong controller getProductsByCategory:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Đổi trạng thái "nổi bật" của sản phẩm
export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Tìm sản phẩm theo ID

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" }); // Kiểm tra nếu không tìm thấy
    }

    product.isFeatured = !product.isFeatured; // Đảo trạng thái nổi bật
    const updatedProduct = await product.save(); // Lưu thay đổi

    await updateFeaturedProductsCache(); // Cập nhật lại cache Redis

    res.json(updatedProduct); // Trả về sản phẩm đã cập nhật
  } catch (error) {
    console.error("Lỗi trong controller toggleFeaturedProduct:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Vui lòng cung cấp từ khóa tìm kiếm." });
    }

    // Tìm kiếm sản phẩm theo tên hoặc mô tả
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    });

    res.json(products);
  } catch (error) {
    console.error("Lỗi trong controller searchProducts:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
// Cập nhật cache Redis với danh sách sản phẩm nổi bật
async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean(); // Lấy sản phẩm nổi bật
    await redis.set("featured_products", JSON.stringify(featuredProducts)); // Cập nhật vào Redis
  } catch (error) {
    console.error("Lỗi khi cập nhật cache Redis:", error.message);
  }
}
