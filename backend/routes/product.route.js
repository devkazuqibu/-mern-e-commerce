import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getFeaturedProducts,
    getProductsByCategory,
    getRecommendedProducts,
    toggleFeaturedProduct,
    searchProducts,
    updateProduct // Import hàm updateProduct một lần duy nhất
} from "../controller/product.controller.js";  // Import đúng các hàm từ controller

const router = express.Router();

// Định nghĩa các route
router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.put("/:id", protectRoute, adminRoute, updateProduct);  // Đảm bảo đã import và sử dụng hàm này đúng
router.delete("/:id", protectRoute, adminRoute, deleteProduct);


router.get("/search", searchProducts);

export default router;
