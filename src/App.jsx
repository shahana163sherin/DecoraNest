import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Menu, LogOut } from "lucide-react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Order from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import ProductDetails from "./components/ProductDetails";

import { useCart } from "./context/CartContext";
import { useWishList } from "./context/WishlistContext";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { cart, dispatch: cartDispatch } = useCart();
  const { wishlist, dispatch: wishDispatch } = useWishList();
  const { user, Logout, loading, setUser } = useAuth();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    Logout();
    setUser(null);
    cartDispatch({ type: "ClearCart" });
    wishDispatch({ type: "ClearWish" });
    setMenuOpen(false);
    navigate("/login");
  };

  const handleMenuClick = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div>
      
      <nav className="bg-[#E0BBE5] text-purple-900 p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => {
              navigate("/");
              closeMenu();
            }}
          >
            DecoraNest
          </h1>

          <button className="md:hidden" onClick={handleMenuClick}>
            <Menu />
          </button>

          <ul
            className={`${
              menuOpen ? "flex" : "hidden"
            } md:flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 absolute md:static top-16 left-0 w-full md:w-auto bg-[#E0BBE4] md:bg-transparent p-4 md:p-0 shadow md:shadow-none z-10`}
          >
            <li>
              <Link to="/" onClick={closeMenu} className="hover:text-white">
                Home
              </Link>
            </li>

            {!user ? (
              <>
                <li>
                  <Link to="/login" onClick={closeMenu} className="hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" onClick={closeMenu} className="hover:text-white">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/orders" onClick={closeMenu} className="hover:text-white">
                    Orders
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-white flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </>
            )}

            <li className="relative">
              <Link to="/wishlist" onClick={closeMenu} className="hover:text-white flex items-center gap-1">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </li>

            <li className="relative">
              <Link to="/cart" onClick={closeMenu} className="hover:text-white flex items-center gap-1">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </div>
  );
};

export default App;

