import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const Order = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!user || !user.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || !user.id) return null;

  const filteredOrders =
    filter === "All"
      ? user.orders
      : user.orders.filter((order) => order.status === filter.toLowerCase());

  const handleCancel = async (orderIndex) => {
    const updatedOrders = [...user.orders];
    updatedOrders[orderIndex].status = "cancelled";

    try {
      const updatedUser = {
        ...user,
        orders: updatedOrders,
      };
      await axios.patch(`http://localhost:3000/users/${user.id}`, updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("Order cancelled successfully.");
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Failed to cancel order.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
         My Orders
      </h2>

      {/* Filter */}
      <div className="flex justify-center gap-3 mb-6">
        {["All", "Pending", "Cancelled", "Delivered"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1 rounded-full text-sm font-medium border ${
              filter === status
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-600">
          No orders found for {filter}.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.map((order, index) => (
            <div
              key={index}
              className="bg-white border shadow-md rounded-lg p-5 transition hover:shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Order #{index + 1}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-1">
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Total:</strong> ₹{order.total}
              </p>

              
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 border p-2 rounded">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-xs text-gray-500">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cancel Button */}
              {order.status === "pending" && (
                <button
                  onClick={() => handleCancel(index)}
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
