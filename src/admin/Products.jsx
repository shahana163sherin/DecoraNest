import { useEffect, useState, useMemo } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router";
import { Pencil, Trash2 } from "lucide-react";

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error in fetching product", err);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) =>
        selectedCategory === "All" ? true : p.category === selectedCategory
      )
      .filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [products, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <button
          onClick={() => navigate("/admin/product/add-product")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="border px-4 py-2 rounded w-full sm:w-1/3"
        />
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border px-4 py-2 rounded w-full sm:w-1/3"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
            <tr>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((p) => (
              <tr
                key={p.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                </td>
                <td className="py-3 px-4 capitalize">{p.name}</td>
                <td className="py-3 px-4 capitalize">{p.category}</td>
                <td className="py-3 px-4 font-medium text-gray-700">
                  ₹{p.price}
                </td>
                <td className="py-3 px-4 space-x-2">
                  <button
                    className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                    onClick={() =>
                      navigate(`/admin/product/edit-product/${p.id}`)
                    }
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                    onClick={() => {
                      setSelectedProduct(p);
                      setShowDeleteModal(true);
                    }}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 rounded ${
              currentPage === num
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 animate-fade-in">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-sm mb-4 text-gray-700">
              Are you sure you want to delete{" "}
              <span className="font-bold">{selectedProduct?.name}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await axios.delete(`/products/${selectedProduct.id}`);
                    setProducts((prev) =>
                      prev.filter((p) => p.id !== selectedProduct.id)
                    );
                    setShowDeleteModal(false);
                  } catch (err) {
                    console.error("Error deleting product:", err);
                    setShowDeleteModal(false);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsAdmin;

