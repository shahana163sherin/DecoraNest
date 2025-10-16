import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";

const AddOrEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    imageFile: null, // store the file
    imageUrl: "",    // for preview
  });

  useEffect(() => {
    if (isEdit) {
      axiosInstance
        .get(`/admin/AdminProduct/${id}`)
        .then((res) => {
          const data = res.data.data;
          setForm({
            name: data.productName,
            category: data.categoryId,
            price: data.price,
            description: data.description,
            imageFile: null,
            imageUrl: data.imgUrl, // show existing image
          });
        })
        .catch((err) => {
          console.error("Error fetching product", err);
          toast.error("Failed to load product");
        });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, imageFile: file, imageUrl: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("ProductName", form.name);
    formData.append("CategoryId", form.category);
    formData.append("Price", form.price);
    formData.append("Description", form.description);
    if (form.imageFile) formData.append("ImageFile", form.imageFile);

    try {
      if (isEdit) {
        await axiosInstance.put(`/admin/AdminProduct/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully!");
      } else {
        await axiosInstance.post("/admin/AdminProduct/Add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added successfully!");
      }
      navigate("/admin/product");
    } catch (err) {
      console.error("Error saving product", err);
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
            Category
          </label>
          <input
            type="number"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            placeholder="Enter category ID"
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

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {form.imageUrl && (
          <div className="flex justify-center mt-4">
            <img
              src={form.imageUrl}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-lg shadow"
            />
          </div>
        )}

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
