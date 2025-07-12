// import { useState, useMemo } from "react";
// import { Heart } from "lucide-react";
// import { useCart } from "../context/CartContext";
// import { useWishList } from "../context/WishlistContext";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { UpdatedWish } from "../services/WishListServices"; 

// const ProductList = ({ products }) => {
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [search, setSearch] = useState("");
//   const [message, setMessage] = useState(false);
//   const { wishlist, dispatch: wishDispatch } = useWishList();
//   const { dispatch } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const categories = useMemo(() => {
//     const unique = new Set(products.map((p) => p.category));
//     return ["All", ...unique];
//   }, [products]);

//   const filteredProducts = products
//     .filter((p) =>
//       selectedCategory === "All"
//         ? true
//         : p.category.toLowerCase() === selectedCategory.toLowerCase()
//     )
//     .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

//  const toggleLike = async (product) => {
//   if (!user) {
//     navigate("/login");
//     return;
//   }

//   const inWish = wishlist.some((item) => item.id === product.id);

//   let updatedWish;

//   if (inWish) {
//     updatedWish = wishlist.filter((item) => item.id !== product.id);
//     wishDispatch({ type: "RemoveFromWish", payload: product.id });
//   } else {
//     updatedWish = [...wishlist, product];
//     wishDispatch({ type: "AddToWish", payload: product });
//   }

//   await UpdatedWish(user.id, updatedWish);
// };


//   return (
//     <div className="px-6 py-10 max-w-7xl mx-auto">
//       {message && (
//         <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded shadow-md z-50">
//           {message}
//         </div>
//       )}

      
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by product name..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full sm:w-64 p-2 rounded-md border border-red-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
//         />

//         <div className="flex flex-wrap gap-2">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setSelectedCategory(cat)}
//               className={`px-4 py-1 rounded-full border text-sm transition-all duration-200 
//                 ${selectedCategory === cat
//                   ? "bg-purple-700 text-white border-purple-700"
//                   : "bg-white text-gray-800 hover:bg-purple-100"
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </div>

      
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//         {filteredProducts.map((product) => {
//           const inWish = wishlist.some((item) => item.id === product.id);

//           return (
//             <div
//               key={product.id}
//               className="bg-purple-50 relative rounded-xl shadow-md hover:shadow-purple-200 p-10 flex flex-col items-center text-center hover:scale-105 transition transform"
//             >
//               <button
//                 className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
//                 onClick={() => toggleLike(product)} 
//                 title="Add to Wishlist"
//               >
//                 <Heart size={20} fill={inWish ? "red" : "none"} strokeWidth={2} />
//               </button>

//               <img
//                 src={product.image}
//                 alt={product.name}
//                 className="w-full h-48 object-cover rounded-lg mb-4"
//               />

//               <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
//               <p className="text-sm text-gray-500 mb-1">{product.category}</p>
//               <p className="text-purple-700 font-bold text-lg mb-3">₹{product.price}</p>

//               <button
//                 type="button"
//                 className="mt-auto bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700 transition"
//                 onClick={() => {
//                   dispatch({ type: "AddToCart", payload: product });
//                   setMessage(`${product.name} added to cart!`);
//                   setTimeout(() => setMessage(false), 2000);
//                 }}
//               >
//                 Add to Cart
//               </button>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ProductList;



import { useState, useMemo } from "react";
import { Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishList } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { UpdatedWish } from "../services/WishListServices";

const ProductList = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(false);
  const { wishlist, dispatch: wishDispatch } = useWishList();
  const { dispatch } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const toggleLike = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const inWish = wishlist.some((item) => item.id === product.id);
    let updatedWish;

    if (inWish) {
      updatedWish = wishlist.filter((item) => item.id !== product.id);
      wishDispatch({ type: "RemoveFromWish", payload: product.id });
    } else {
      updatedWish = [...wishlist, product];
      wishDispatch({ type: "AddToWish", payload: product });
    }

    await UpdatedWish(user.id, updatedWish);
  };

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded shadow-md z-50">
          {message}
        </div>
      )}

      {/* Search and Category Filter */}
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
              className={`px-4 py-1 rounded-full border text-sm transition-all duration-200 
                ${
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

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredProducts.map((product) => {
          const inWish = wishlist.some((item) => item.id === product.id);

          return (
            <div
              key={product.id}
              className="bg-purple-50 relative rounded-xl shadow-md hover:shadow-purple-200 p-6 flex flex-col items-center text-center hover:scale-105 transition transform"
            >
              {/* Wishlist Heart Icon */}
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                onClick={() => toggleLike(product)}
                title="Add to Wishlist"
              >
                <Heart size={20} fill={inWish ? "red" : "none"} strokeWidth={2} />
              </button>

              {/* Image with zoom effect */}
              <div className="w-full h-48 overflow-hidden flex items-center justify-center bg-white rounded-lg mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full object-contain transition-transform duration-300 hover:scale-110"
                />
              </div>

              {/* Product Info */}
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-1">{product.category}</p>
              <p className="text-purple-700 font-bold text-lg mb-3">₹{product.price}</p>

              {/* Add to Cart Button */}
              <button
                type="button"
                className="mt-auto bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700 transition"
                onClick={() => {
                  dispatch({ type: "AddToCart", payload: product });
                  setMessage(`${product.name} added to cart!`);
                  setTimeout(() => setMessage(false), 2000);
                }}
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;

