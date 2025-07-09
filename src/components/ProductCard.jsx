import { useState } from "react";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { dispatch } = useCart();
  const [showAlert, setShowAlert] = useState(false);

  const handleAddToCart = () => {
    dispatch({ type: "AddToCart", payload: product });  

    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000); 
  };

  return (
    <div className="relative">
    
      {showAlert && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded shadow-md z-50">
           {product.name} added to cart!
        </div>
      )}

      
      <div className="bg-white rounded-xl shadow-lg p-4 w-72 hover:scale-105 transition transform">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg mb-3"
        />
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-500">{product.category}</p>
        <p className="text-purple-700 font-bold text-lg mb-2">₹{product.price}</p>

        <button
          onClick={handleAddToCart}
          className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
