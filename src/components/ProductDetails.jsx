import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productServices";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const { addItemToCart } = useCart();
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
       
        const p = res?.data?.data || res?.data || null;
        setProduct(p);
      } catch (err) {
        console.error("Error fetching product:", err);
        navigate("/"); 
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (!product) return <h2 className="text-center text-lg mt-10">Loading...</h2>;

  const handleAddToCart = async () => {
    try {
      if (!user) {
        alert("Please log in to add items to the cart.");
        navigate("/login");
        return;
      }
      if (isAdmin) {
        alert("Admins cannot add to cart.");
        return;
      }

      const productId = product.id || product.productId || product.ProductID;
      await addItemToCart(productId, 1);
      setMessage(`${product.productName || product.name} added to cart!`);
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Add to cart failed:", err);
      setMessage(err.message || "Failed to add to cart");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      {message && (
        <div className="bg-green-600 text-white px-6 py-3 rounded-md shadow-lg text-center mb-6 animate-pulse">
          {message}
        </div>
      )}
      <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2">
          <img
            src={product.imageUrl || product.image || product.ImageUrl}
            alt={product.productName || product.name}
            className="w-full h-72 object-contain rounded-lg border"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <h2 className="text-2xl font-bold text-purple-800">{product.productName || product.name}</h2>
          <p className="text-gray-600 text-sm">
            Category: <span className="capitalize">{product.category}</span>
          </p>
          <p className="text-purple-700 font-semibold text-xl">₹ {product.price || product.Price}</p>
          <p className="text-gray-500 text-sm">{product.description}</p>

          <button
            onClick={handleAddToCart}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-all shadow-md hover:scale-105"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;


