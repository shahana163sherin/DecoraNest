import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const { dispatch } = useCart();
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error in fetching", err);
        navigate("/");
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (!product) return <h2 className="text-center text-lg mt-10">Loading...</h2>;

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
            src={product.image}
            alt={product.name}
            className="w-full h-72 object-contain rounded-lg border"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <h2 className="text-2xl font-bold text-purple-800">{product.name}</h2>
          <p className="text-gray-600 text-sm">Category: <span className="capitalize">{product.category}</span></p>
          <p className="text-purple-700 font-semibold text-xl">₹{product.price}</p>
          <p className="text-gray-500 text-sm">
            {product.description}
          </p>

          <button
            onClick={() => {
              dispatch({ type: "AddToCart", payload: product });
              setMessage(`${product.name} Added to cart`);
              setTimeout(() => {
                setMessage(false);
              }, 2000);
            }}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-all shadow-md hover:scale-105"
          >
            🛒 Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
