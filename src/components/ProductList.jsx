
// import { useState, useMemo } from "react";
// import { Heart } from "lucide-react";
// import { useCart } from "../context/CartContext";
// import { useWishList } from "../context/WishlistContext";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate,Link } from "react-router-dom";
// // import { UpdatedWish } from "../services/WishListServices";
// import { toggleWish } from "../services/WishListServices";


// const ProductList = ({ products }) => {
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [search, setSearch] = useState("");
//   const [message, setMessage] = useState(false);
//   const { wishlist, dispatch: wishDispatch } = useWishList();
//   const { dispatch } = useCart();
//   const { user,setUser } = useAuth();
//   const navigate = useNavigate();

//   const categories = useMemo(() => {
//   const unique = new Set((products || []).map((p) => p.Category));
//   return ["All", ...unique];
// }, [products]);


//  const filteredProducts = (products || [])
//   .filter((p) =>
//     selectedCategory === "All"
//       ? true
//       : p.Category.toLowerCase() === selectedCategory.toLowerCase()
//   )
//   .filter((p) => p.ProductName.toLowerCase().includes(search.toLowerCase()));

//      const isAdmin = user?.role === "Admin";

//   const toggleWishlistItem = async (product) => {
//   if (!user) {
//     navigate("/login");
//     return;
//   }

//   if (isAdmin) {
//     alert("Admins cannot add products to wishlist.");
//     return;
//   }

//   try {
//     const updatedWishlist = await toggleWish(product.ProductId); 
//     wishDispatch({ type: "SetWishList", payload: updatedWishlist });
//     const updatedUser = { ...user, wishlist: updatedWishlist };
//     localStorage.setItem("user", JSON.stringify(updatedUser));
//     setUser(updatedUser);
//   } catch (err) {
//     console.error("Failed to toggle wishlist:", err);
//   }




//     // const inWish = wishlist.some((item) => item.id === product.ProductId);
//     // let updatedWish;

//     // if (inWish) {
//     //   updatedWish = wishlist.filter((item) => item.id !== product.ProductId);
//     //   wishDispatch({ type: "RemoveFromWish", payload: product.ProductId });
//     // } else {
//     //   updatedWish = [...wishlist, product];
//     //   wishDispatch({ type: "AddToWish", payload: product });
//     // }

//     // await UpdatedWish(user.id, updatedWish);
//   };

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
//                 ${
//                   selectedCategory === cat
//                     ? "bg-purple-700 text-white border-purple-700"
//                     : "bg-white text-gray-800 hover:bg-purple-100"
//                 }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </div>

     
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//         {filteredProducts.map((product) => {
//           const inWish = wishlist.some((item) => item.ProductId === product.ProductId);

//           return (
//             <div
//               key={product.ProductId}
//               className="bg-purple-50 relative rounded-xl shadow-md hover:shadow-purple-200 p-6 flex flex-col items-center text-center hover:scale-105 transition transform"
//             >
//               <button
//                 className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
//                 onClick={() => toggleWishlistItem(product)}
//                 title="Add to Wishlist"
//               >
//                 <Heart size={20} fill={inWish ? "red" : "none"} strokeWidth={2} />
//               </button>
               
//                <Link to = {`/product/${product.id}`}>
             
//               <div className="w-full h-48 overflow-hidden flex items-center justify-center bg-white rounded-lg mb-4">
//                 <img
//                   src={product.ImageUrl}
//                   alt={product.ProductName}
//                   className="h-full object-contain transition-transform duration-300 hover:scale-200"
//                 />
//               </div>

              
//               <h3 className="text-lg font-semibold text-gray-800">{product.ProductName}</h3>
//               <p className="text-sm text-gray-500 mb-1">{product.Category}</p>
//               <p className="text-purple-700 font-bold text-lg mb-3">₹{product.Price}</p>
//               </Link>

              
//               <button
//                 type="button"
//                 className="mt-auto bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700 transition"
//                 onClick={() => {
                  
//     if (!user) {
//       alert("Please log in to add items to the cart.");
//       navigate("/login");
//       return;
//     }
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


// src/pages/ProductList.jsx
import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts, getProductsByCategory } from "../services/productServices";
import { useWishList } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const { wishlist, toggleWishlistItem } = useWishList();
  const { addItemToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "Admin";

  const fetchProducts = async (category = "All") => {
    try {
      const res =
        category !== "All" ? await getProductsByCategory(category) : await getAllProducts();
      // many of your product endpoints return { data: { data: [...] } } or { data: [...] }
      const arr = res?.data?.data || res?.data || [];
      setProducts(arr);
      const uniqueCategories = Array.from(new Set(arr.map((p) => p.category || p.Category || p.categoryName).filter(Boolean)));
      setCategories(["All", ...uniqueCategories]);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  const handleToggleWishlist = async (product) => {
    try {
      const updated = await toggleWishlistItem(product);
      setMessage(
        `${product.productName || product.name} ${
          updated.some((p) => (p.productId || p.id) === (product.productId || product.id))
            ? "added to"
            : "removed from"
        } wishlist!`
      );
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      alert(err.message || "Wishlist error");
    }
  };

  const handleAddToCart = async (product) => {
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

      // pick id with various possible keys
      const id = product.id || product.productId || product.ProductID || product.productID;
      await addItemToCart(id, 1);
      setMessage(`${product.productName || product.name} added to cart!`);
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Add to cart error:", err);
      setMessage(err.response?.data?.message || err.message || "Network error");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const filteredProducts = products.filter((p) =>
    (p.productName || p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded shadow-md z-50">
          {message}
        </div>
      )}

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
                selectedCategory === cat ? "bg-purple-700 text-white border-purple-700" : "bg-white text-gray-800 hover:bg-purple-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredProducts.map((product) => {
          const inWish = wishlist.some((item) => (item.productId || item.id) === (product.productId || product.id));
          return (
            <div
              key={product.productId || product.id}
              className="bg-purple-50 relative rounded-xl shadow-md hover:shadow-purple-200 p-6 flex flex-col items-center text-center hover:scale-105 transition transform"
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                onClick={() => handleToggleWishlist(product)}
                title="Add to Wishlist"
              >
                <Heart size={20} fill={inWish ? "red" : "none"} strokeWidth={2} />
              </button>

              <Link to={`/product/${product.productId || product.id}`}>
                <div className="w-full h-48 overflow-hidden flex items-center justify-center bg-white rounded-lg mb-4">
                  <img
                    src={product.imageUrl || product.image || product.ImageUrl}
                    alt={product.productName || product.name}
                    className="h-full object-contain transition-transform duration-300 hover:scale-200"
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-800">{product.productName || product.name}</h3>
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <p className="text-purple-700 font-bold text-lg mb-3">₹{product.price || product.Price}</p>
              </Link>

              <button
                type="button"
                className="mt-auto bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700 transition"
                onClick={() => handleAddToCart(product)}
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
