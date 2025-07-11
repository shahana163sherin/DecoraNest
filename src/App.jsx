// // import { Routes, Route, Link } from "react-router-dom";
// // import Home from "./pages/Home";
// // import Login from "./pages/Login";
// // import Cart from "./pages/Cart";
// // import Register from "./pages/Register";
// // import Order from "./pages/Orders";
// // import { useCart } from "./context/CartContext";
// // import { useWishList } from "./context/WishlistContext";
// // import Wishlist from './pages/wishlist'
// // import { ShoppingCart, Heart } from "lucide-react"; 


// // const App = () => {
// //   const { cart } = useCart();
// //   const { wishlist } = useWishList();

// //   const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

// //   return (
// //     <div>
// //       <nav className="text-purple-900 p-4 shadow-md" style={{ backgroundColor: "#E0BBE4" }}>
// //         <div className="max-w-6xl mx-auto flex justify-between items-center">
// //           <h1 className="text-xl font-bold">DecoraNest</h1>
// //           <ul className="flex space-x-6 items-center">
// //             <li>
// //               <Link to="/" className="hover:text-white">Home</Link>
// //             </li>
// //             <li>
// //               <Link to="/login" className="hover:text-white">Login</Link>
// //             </li>
// //             <li>
// //               <Link to="/register" className="hover:text-white">Register</Link>
// //             </li>

           
// //             <li className="relative">
// //               <Link to="/wishlist" className="hover:text-white flex items-center gap-1">
// //                 <Heart className="w-5 h-5" />
// //               </Link>
// //               {wishlist.length > 0 && (
// //                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
// //                   {wishlist.length}
// //                 </span>
// //               )}
// //             </li>

// //             <li className="relative">
// //               <Link to="/cart" className="hover:text-white flex items-center gap-1">
// //                 <ShoppingCart className="w-5 h-5" />
// //               </Link>
// //               {totalItems > 0 && (
// //                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
// //                   {totalItems}
// //                 </span>
// //               )}
// //             </li>
// //           </ul>
// //         </div>
// //       </nav>

// //       <Routes>
// //         <Route path="/" element={<Home />} />
// //         <Route path="/login" element={<Login />} />
// //         <Route path="/register" element={<Register />} />
// //         <Route path="/cart" element={<Cart />} />
// //         <Route path="/orders" element={<Order />} />
// //         <Route path="/wishlist" element={<Wishlist />} />

// //       </Routes>




// //     </div>
// //   );
// // };

// // export default App;



// import { useState } from "react";
// import { Routes, Route, Link } from "react-router-dom";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Cart from "./pages/Cart";
// import Register from "./pages/Register";
// import Order from "./pages/Orders";
// import Wishlist from './pages/wishlist';
// import { useCart } from "./context/CartContext";
// import { useWishList } from "./context/WishlistContext";
// import { ShoppingCart, Heart, Menu } from "lucide-react";

// const App = () => {
//   const { cart } = useCart();
//   const { wishlist } = useWishList();
//   const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <div>
//       {/* Navbar */}
//       <nav className="text-purple-900 p-4 shadow-md" style={{ backgroundColor: "#E0BBE4" }}>
//         <div className="max-w-6xl mx-auto flex justify-between items-center">
//           <h1 className="text-xl font-bold">DecoraNest</h1>

//           {/* Hamburger Icon (Mobile) */}
//           <div className="md:hidden">
//             <button onClick={() => setMenuOpen(!menuOpen)}>
//               <Menu />
//             </button>
//           </div>

//           {/* Links */}
//           <ul className={`md:flex items-center space-x-6 ${menuOpen ? "block" : "hidden"} absolute md:static bg-[#E0BBE4] md:bg-transparent top-16 left-0 w-full md:w-auto p-4 md:p-0 shadow-md md:shadow-none`}>
//             <li>
//               <Link to="/" className="hover:text-white block py-2 md:py-0" onClick={() => setMenuOpen(false)}>Home</Link>
//             </li>
//             <li>
//               <Link to="/login" className="hover:text-white block py-2 md:py-0" onClick={() => setMenuOpen(false)}>Login</Link>
//             </li>
//             <li>
//               <Link to="/register" className="hover:text-white block py-2 md:py-0" onClick={() => setMenuOpen(false)}>Register</Link>
//             </li>

//             <li className="relative">
//               <Link to="/wishlist" className="hover:text-white flex items-center gap-1" onClick={() => setMenuOpen(false)}>
//                 <Heart className="w-5 h-5" />
//                 {wishlist.length > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
//                     {wishlist.length}
//                   </span>
//                 )}
//               </Link>
//             </li>

//             <li className="relative">
//               <Link to="/cart" className="hover:text-white flex items-center gap-1" onClick={() => setMenuOpen(false)}>
//                 <ShoppingCart className="w-5 h-5" />
//                 {totalItems > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
//                     {totalItems}
//                   </span>
//                 )}
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </nav>

//       {/* Routes */}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/orders" element={<Order />} />
//         <Route path="/wishlist" element={<Wishlist />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;




import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Order from "./pages/Orders";
import Wishlist from './pages/wishlist';
import { useCart } from "./context/CartContext";
import { useWishList } from "./context/WishlistContext";
import { useAuth } from "./context/AuthContext"; // 👈 Import AuthContext
import { ShoppingCart, Heart, Menu, LogOut } from "lucide-react";

const App = () => {
  const { cart } = useCart();
  const { wishlist,dispatch:wishDispatch } = useWishList();
  const {dispatch:cartDispatch}=useCart();
  const { user, Logout ,loading} = useAuth(); 
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    Logout();

    cartDispatch({type:"ClearCart"})
    wishDispatch({type:"ClearCart"})
   
    navigate("/login");
  };
  if (loading) return <p className="text-center mt-10">Loading...</p>; 

  return (
    <div>
      {/* Navbar */}
      <nav className="text-purple-900 p-4 shadow-md" style={{ backgroundColor: "#E0BBE4" }}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">DecoraNest</h1>

          {/* Hamburger Icon (Mobile) */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <Menu />
            </button>
          </div>

          {/* Links */}
          <ul className={`md:flex items-center space-x-6 ${menuOpen ? "block" : "hidden"} absolute md:static bg-[#E0BBE4] md:bg-transparent top-16 left-0 w-full md:w-auto p-4 md:p-0 shadow-md md:shadow-none`}>
            <li>
              <Link to="/" className="hover:text-white block py-2 md:py-0" onClick={() => setMenuOpen(false)}>Home</Link>
            </li>

            {!user && (
              <>
                <li>
                  <Link to="/login" className="hover:text-white block py-2 md:py-0" onClick={() => setMenuOpen(false)}>Login</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white block py-2 md:py-0" onClick={() => setMenuOpen(false)}>Register</Link>
                </li>
              </>
            )}

            {user && (
              <>
                <li>
                  <Link to="/orders" className="hover:text-white block py-2 md:py-0" onClick={() => setMenuOpen(false)}>Orders</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="hover:text-white  py-2 md:py-0 flex items-center gap-1 text-red-700">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </>
            )}

            <li className="relative">
              <Link to="/wishlist" className="hover:text-white flex items-center gap-1" onClick={() => setMenuOpen(false)}>
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </li>

            <li className="relative">
              <Link to="/cart" className="hover:text-white flex items-center gap-1" onClick={() => setMenuOpen(false)}>
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </div>
  );
};

export default App;


