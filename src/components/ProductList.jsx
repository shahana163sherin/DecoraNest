import { useEffect, useState, useMemo } from "react";
// import axios from "axios";
import  {getAllProducts} from '../services/productServices'

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
       getAllProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

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

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/5 p-2 border rounded"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1 rounded-full border ${
              selectedCategory === cat ? "bg-black text-white" : "bg-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-green-600 font-bold">₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
