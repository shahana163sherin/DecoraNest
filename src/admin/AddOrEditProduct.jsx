import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";

const AddOrEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    image: "",
    category: "",
    price: "",
    description: "",
  });

  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      axios.get(`/products/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => {
          console.error("Error fetching product", err);
          toast.error("Failed to load product");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await axios.put(`/products/${id}`, form);
        toast.success("Product updated successfully!");
      } else {
        await axios.post("/products", {
          ...form,
          createdAt: new Date().toISOString(),
        });
        toast.success("Product added successfully!");
      }
      navigate("/admin/product");
    } catch (error) {
      console.error("Error saving product", error);
      toast.error("Failed to save product");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-6 py-8 bg-white shadow-xl rounded-2xl">
      <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
        {isEdit ? "Edit Product" : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Enter product name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

  
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="url"
            name="image"
            value={form.image}
            onChange={handleChange}
            required
            placeholder="Paste image URL here"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

   
        {form.image && (
          <div className="flex justify-center mt-4">
            <img
              src={form.image}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-lg shadow"
            />
          </div>
        )}

        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            placeholder="e.g. Wall Decor, Vase"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Price (₹)
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            placeholder="Enter product price"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

      
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Write a short product description..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 shadow-md"
        >
          {isEdit ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddOrEditProduct;


