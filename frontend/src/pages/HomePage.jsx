import { useEffect, useRef } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
  { href: "/jeans", name: "Quần jeans", imageUrl: "/jeans.jpg" },
  { href: "/t-shirts", name: "Áo thun", imageUrl: "/tshirts.jpg" },
  { href: "/shoes", name: "Giày", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Kính mắt", imageUrl: "/glasses.png" },
  { href: "/jackets", name: "Áo khoác", imageUrl: "/jackets.jpg" },
  { href: "/suits", name: "Bộ vest", imageUrl: "/suits.jpg" },
  { href: "/bags", name: "Túi xách", imageUrl: "/bags.jpg" },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();
  const carouselRef = useRef(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const maxScrollLeft =
          carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
        if (carouselRef.current.scrollLeft >= maxScrollLeft) {
          carouselRef.current.scrollLeft = 0;
        } else {
          carouselRef.current.scrollLeft += carouselRef.current.offsetWidth;
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCarouselControl = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({
        top: 0,
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Nội dung trang */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Carousel */}
        <div className="relative mb-10">
          <div
            className="overflow-hidden rounded-lg"
            ref={carouselRef}
          >
            <div className="flex transition-transform ease-out duration-500">
              <div className="flex-shrink-0 w-full">
                <img
                  src="/slide_1_img.webp"
                  alt="Slide 1"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="flex-shrink-0 w-full">
                <img
                  src="/slide_3_img.webp"
                  alt="Slide 2"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="flex-shrink-0 w-full">
                <img
                  src="/slide_4_img.webp"
                  alt="Slide 3"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
          {/* Nút điều khiển */}
          <button
            onClick={() => handleCarouselControl("prev")}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-emerald-600 p-3 rounded-full hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            &#8249;
          </button>
          <button
            onClick={() => handleCarouselControl("next")}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-emerald-600 p-3 rounded-full hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            &#8250;
          </button>
        </div>

        {/* Danh mục sản phẩm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        {/* Sản phẩm nổi bật */}
        {!isLoading && products.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}
      </div>

      {/* Nút cuộn lên đầu */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        ⬆
      </button>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Thông tin chung */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-8">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-emerald-400 mb-2">Khoa</h1>
              <p className="text-sm">Tổng đài CSKH: 02873066060</p>
              <p className="text-sm">Email: cskh@icondenim.com</p>
            </div>

            {/* Đăng ký nhận tin */}
            <div className="mt-6 sm:mt-0">
              <h3 className="text-xl font-semibold text-emerald-400 mb-2">
                ĐĂNG KÝ NHẬN TIN
              </h3>
              <p className="text-sm mb-4">Hãy là người đầu tiên nhận khuyến mãi lớn!</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  className="px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button className="bg-emerald-600 text-white px-6 py-2 rounded-r-md">
                  ĐĂNG KÝ
                </button>
              </div>
            </div>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-emerald-400 mb-4">
                HỖ TRỢ KHÁCH HÀNG
              </h3>
              <ul>
                <li>
                  <a href="#" className="hover:text-emerald-400">
                    Chính sách đổi hàng và bảo hành
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400">
                    Chính sách Membership
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-emerald-400 mb-4">
                HỆ THỐNG CỬA HÀNG
              </h3>
              <ul>
                <li>12-12Bis, CMT8, P.Bến Thành, Q.1, HCM</li>
              </ul>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400">
            &copy; 2024 Bản quyền thuộc về Khoa
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
