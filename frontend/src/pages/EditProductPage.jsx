import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Upload, Loader } from "lucide-react";


const EditProductPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(false); 
  const [imagePreview, setImagePreview] = useState(""); 
  const [categories, setCategories] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      try {
        // Fetch thông tin sản phẩm
        const productResponse = await axios.get(`/products/${id}`);
        setProduct(productResponse.data); 
        setImagePreview(productResponse.data.image);

        // Fetch danh mục sản phẩm
        const categoriesResponse = await axios.get("/categories");
        // Kiểm tra xem categoriesResponse có phải là một mảng không
        if (Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        } else {
          toast.error("Categories data is not an array.");
        }
      } catch (error) {
        toast.error(`Failed to fetch data: ${error.message}`); 
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, [id]); 

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true); 
    try {
      await axios.patch(`/products/${id}`, product); 
      toast.success("Product updated successfully!"); 
      navigate("/products"); 
    } catch (error) {
      toast.error(`Failed to update product: ${error.message}`); 
    } finally {
      setLoading(false); 
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value, 
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setProduct({ ...product, image: reader.result });
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div>Loading...</div>; 

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6"></h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="text-sm font-medium text-gray-300">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 bg-gray-700 text-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="text-sm font-medium text-gray-300">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 bg-gray-700 text-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="text-sm font-medium text-gray-300">Category</label>
          <select
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 bg-gray-700 text-gray-300 rounded-md"
            required
          >
            <option value="">Select a category</option>
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="text-sm font-medium text-gray-300">Description</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 bg-gray-700 text-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mt-4 mb-4">
          <label htmlFor="image" className="text-sm font-medium text-gray-300">Upload Image</label>
          <div className="flex items-center">
            <input
              type="file"
              id="image"
              className="sr-only"
              accept="image/*"
              onChange={handleImageChange}
            />
            <label
              htmlFor="image"
              className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <Upload className="h-5 w-5 inline-block mr-2" />
              Upload Image
            </label>
          </div>

          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md"
        >
          {loading ? (
            <div className="flex items-center">
              <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              Updating...
            </div>
          ) : (
            "Update Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
