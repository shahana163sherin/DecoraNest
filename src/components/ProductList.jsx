import { useState, useMemo } from "react";
import { Heart } from "lucide-react";

const ProductList = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [likedItems, setLikedItems] = useState([]); 


  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return ["All", ...unique];
  }, [products]);


  const filteredProducts = products
    .filter((p) =>
      selectedCategory === "All"
        ? true
        : p.category.toLowerCase() === selectedCategory.toLowerCase()
    )
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  
  const toggleLike = (id) => {
    setLikedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
    
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 p-2 rounded-md border border-red-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 rounded-full border text-sm transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-purple-700 text-white border-purple-700"
                  : "bg-white text-gray-800 hover:bg-purple-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-purple-50 relative rounded-xl shadow-md hover:shadow-purple-200 p-10 flex flex-col items-center text-center hover:scale-105 transition transform"
          >
           
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              onClick={() => toggleLike(product.id)}
              title="Add to Wishlist"
            >
              <Heart
                size={20}
                fill={likedItems.includes(product.id) ? "red" : "none"}
                strokeWidth={2}
              />
            </button>

           
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
            <p className="text-purple-700 font-bold text-lg mb-3">
              ₹{product.price}
            </p>

            <button className="mt-auto bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700 transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
