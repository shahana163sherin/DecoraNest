import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; 
import axios from "axios";
import { useState } from "react";

const Cart = () => {
  const { cart, dispatch } = useCart();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [address,setAddress]=useState(null);

  if (cart.length === 0) return <h2 className="text-center text-xl mt-10">🛒 Your cart is empty</h2>;

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!user || !user.id) {
    alert("Please log in to place an order.");
    navigate("/login");
    return;
  }
  if (!address.trim()) {
    alert("Please enter your address.");
    return;
  }


    try {
      const order = {
        items: cart,
        total,
        address:address,
        createdAt: new Date().toISOString(),
        status: "pending"
      };

      const updatedUser = {
        ...user,
       orders: [...(user.orders || []), order],
        cart: []
      };
      console.log("Current user:", user);

      await axios.patch(`http://localhost:3000/users/${user.id}`, updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      dispatch({ type: "ClearCart" });
      alert("Order placed Successfully")
       navigate("/orders");

     
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      alert(" Failed to place order. Try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">🛒 Your Cart</h2>
      <div className="space-y-4">
        
        {cart.map((item) => (
          <div key={item.id} className="p-4 border rounded shadow-sm flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">{item.name}</h3>
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
              <div className="flex gap-2 mt-2">
                <button onClick={() => dispatch({ type: "DecQntity", payload: item.id })} disabled={item.quantity <= 1}>-</button>
                <span className="text-sm text-gray-600">{item.quantity}</span>
                <button onClick={() => dispatch({ type: "IncQuantity", payload: item.id })}>+</button>
              </div>
              <p className="text-sm text-gray-800 mt-1">Price: ₹{item.price}</p>
            </div>
            <button
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
              onClick={() => dispatch({ type: "RemoveFromCart", payload: item.id })}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right">
        <h2 className="text-xl font-bold mb-2">Total: ₹{total}</h2>
      <input
          type="text"
          placeholder="Enter your address(Place,District,State,Landmark):"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          className="w-full p-3 border border-purple-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
        />

        <button
          onClick={handlePlaceOrder}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
           Place Order
        </button>
      </div>
    </div>
  );
};

export default Cart;

