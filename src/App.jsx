import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Register from "./pages/Register";

const App = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="text-purple-900 p-4 shadow-md" style={{backgroundColor:'#E0BBE4'}}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">
            DecoraNest
          </h1>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-white">Home</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white">Login</Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-white">Register</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-white">Cart</Link>
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
      </Routes>
    </div>
  );
};

export default App;
