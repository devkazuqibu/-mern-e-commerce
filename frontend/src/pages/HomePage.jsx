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
<script
    src="https://app.preny.ai/bot-embed.js"
    data-preny-bot-id="6750bc21ef8d04a523f8e3db"
    async
    defer
  />
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
      {/* Nút Messenger */}
      <a
        href="https://m.me/207110309151655"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        title="Chat với chúng tôi trên Messenger"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-6 h-6"
        >
          <path d="M12 2C6.486 2 2 6.225 2 11.46c0 2.93 1.527 5.53 3.956 7.246v3.187L9.59 19.7c.778.215 1.603.34 2.41.34 5.514 0 10-4.225 10-9.54S17.514 2 12 2zm2.636 10.354l-2.315-1.737-3.03 1.737 2.315-3.747 3.03-1.737-2.315 3.747 2.315 1.737z" />
        </svg>
      </a>

      {/* Nội dung trang */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Carousel */}
        <div className="relative mb-10">
          <div className="overflow-hidden rounded-lg" ref={carouselRef}>
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
          {/* Footer content here */}
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
