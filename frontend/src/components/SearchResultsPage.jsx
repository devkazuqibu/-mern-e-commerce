import { useLocation } from "react-router-dom";

const SearchResultsPage = () => {
  const location = useLocation();
  const products = location.state?.products || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-emerald-400 mb-4">Kết quả tìm kiếm</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded-md p-4 shadow-sm bg-gray-800">
              <img src={product.image} alt={product.name} className="h-40 w-full object-cover rounded mb-4" />
              <h3 className="text-lg font-semibold text-white">{product.name}</h3>
              <p className="text-gray-400">{product.description}</p>
              <p className="text-emerald-400 font-bold mt-2">${product.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-300">Không tìm thấy sản phẩm phù hợp với từ khóa của bạn.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;
