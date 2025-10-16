
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// const Order = () => {
//   const { user, setUser, loading } = useAuth();
//   const [loadingOrders, setLoadingOrders] = useState(true);
//   const [filter, setFilter] = useState("All");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (loading) return;
//     // if (!user || !user.id) {
//     //   navigate("/login");
//     //   return;
//     // }

//     const fetchOrders = async () => {
//       try {
//         const res = await axios.get(`http://localhost:3000/users/${user.id}`);
//         setUser(res.data);
//         setLoadingOrders(false);
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         setLoadingOrders(false);
//       }
//     };

//     fetchOrders();
//   }, [user?.id, loading, navigate, setUser]);

//   const handleCancel = async (index) => {
//     const updatedOrders = [...user.orders];
//     updatedOrders[index].status = "cancelled";

//     try {
//       const updatedUser = { ...user, orders: updatedOrders };
//       await axios.patch(`http://localhost:3000/users/${user.id}`, updatedUser);
//       setUser(updatedUser);
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       alert("Order cancelled.");
//     } catch (err) {
//       console.error("Cancel error:", err);
//       alert("Failed to cancel.");
//     }
//   };

//   if (loading || loadingOrders) {
//     return <p className="text-center mt-10 text-gray-600 text-lg">Loading your orders...</p>;
//   }

//   if (!user || !user.orders || user.orders.length === 0) {
//     return <p className="text-center mt-10 text-gray-600 text-lg">No orders found.</p>;
//   }

//   const filteredOrders =
//     filter === "All"
//       ? user.orders
//       : user.orders.filter((order) => order.status === filter.toLowerCase());

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 border border-yellow-300";
//       case "cancelled":
//         return "bg-red-100 text-red-800 border border-red-300";
//       case "delivered":
//         return "bg-green-100 text-green-800 border border-green-300";
//       case "processing":
//         return "bg-blue-200 text-blue-800 border border-blue-300";
//       default:
//         return "bg-gray-200 text-gray-700 border border-gray-300";
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-10">
//       <h2 className="text-4xl font-bold text-center mb-8 text-purple-800"> My Orders</h2>

      
//       <div className="flex justify-center gap-4 mb-10 flex-wrap">
//         {["All", "Pending", "Processing","Cancelled", "Delivered"].map((status) => (
//           <button
//             key={status}
//             onClick={() => setFilter(status)}
//             className={`px-5 py-2 rounded-full text-sm font-semibold transition duration-300 border ${
//               filter === status
//                 ? "bg-purple-600 text-white border-purple-600 shadow-md"
//                 : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//             }`}
//           >
//             {status}
//           </button>
//         ))}
//       </div>

     
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
//         {filteredOrders.map((order, index) => (
//           <div
//             key={index}
//             className="bg-white rounded-xl shadow-lg p-6 border hover:shadow-xl transition"
//           >
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="text-lg font-semibold text-purple-700">
//                 Order #{index + 1}
//               </h3>
//               <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(order.status)}`}>
//                 {order.status}
//               </span>
//             </div>

//             <p className="text-sm text-gray-600">
//               <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
//             </p>
//             <p className="text-sm text-gray-600 mb-3">
//               <strong>Total:</strong> ₹{order.total}
//             </p>
//              <p className="text-sm text-gray-600 mb-3">
//               <strong>Address:</strong> {order.address}
//             </p>

//             <div className="space-y-3">
//               {order.items.map((item, i) => (
//                 <div
//                   key={i}
//                   className="flex gap-4 items-center border rounded-lg p-3 bg-gray-50"
//                 >
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-14 h-14 rounded object-cover border"
//                   />
//                   <div>
//                     <p className="text-sm font-medium text-gray-800">{item.name}</p>
//                     <p className="text-xs text-gray-500">
//                       Qty: {item.quantity} • ₹{item.price}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {order.status === "pending" && (
//               <button
//                 onClick={() => handleCancel(index)}
//                 className="mt-5 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
//               >
//                 Cancel Order
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Order;

import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance"; // <-- axios with token included
import { useAuth } from "../context/AuthContext";

const Order = () => {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [filter, setFilter] = useState("All");

  // ✅ Fetch all orders for the logged-in user
  useEffect(() => {
    if (loading) return;

    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/user/Order/AllOrders");
        setOrders(res.data.data); 
        // console.log(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [loading]);

  // ✅ Handle cancel order
  const handleCancel = async (orderId) => {
    try {
      const res = await axiosInstance.post("/user/Order/Cancel", {
        orderId,
      });

      if (res.data.status === "Success") {
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === orderId ? { ...o, status: "Cancelled" } : o
          )
        );
        alert("Order cancelled successfully!");
      } else {
        alert(res.data.message || "Failed to cancel order.");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel order.");
    }
  };

 
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter(
          (order) => order.status.toLowerCase() === filter.toLowerCase()
        );

 
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-300";
      case "delivered":
        return "bg-green-100 text-green-800 border border-green-300";
      case "processing":
        return "bg-blue-200 text-blue-800 border border-blue-300";
      default:
        return "bg-gray-200 text-gray-700 border border-gray-300";
    }
  };

  if (loading || loadingOrders)
    return (
      <p className="text-center mt-10 text-gray-600 text-lg">
        Loading your orders...
      </p>
    );

  if (!orders || orders.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600 text-lg">
        No orders found.
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-center mb-8 text-purple-800">
        My Orders
      </h2>

      {/* FILTER BUTTONS */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {["All", "Pending", "Processing", "Cancelled", "Delivered"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition duration-300 border ${
                filter === status
                  ? "bg-purple-600 text-white border-purple-600 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* ORDER CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {filteredOrders.map((order, index) => (
          <div
            key={order.orderId || index}
            className="bg-white rounded-xl shadow-lg p-6 border hover:shadow-xl transition"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-purple-700">
                Order #{order.orderId}
              </h3>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <p className="text-sm text-gray-600">
              <strong>Date:</strong>{" "}
              {new Date(order.orderDate).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <strong>Total:</strong> ₹{order.totalAmount}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <strong>Address:</strong> {order.address}
            </p>

            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-center border rounded-lg p-3 bg-gray-50"
                >
                  <img
                    src={item.imgUrl}
                    alt={item.productName}
                    className="w-14 h-14 rounded object-cover border"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} • ₹{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {order.status?.toLowerCase() === "pending" && (
              <button
                onClick={() => handleCancel(order.orderId)}
                className="mt-5 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
              >
                Cancel Order
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
