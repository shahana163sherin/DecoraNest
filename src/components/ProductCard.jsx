
const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-72 hover:scale-105 transition transform">
      <img
        src={product.image}
        alt={product.name}
      className="w-full h-48 object-cover rounded-lg mb-3"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p  className="text-gray-500">{product.category}</p>
      <p  className="text-purple-700 font-bold text-lg mb-2">₹{product.price}</p>

      <button className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
