// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useEffect, useState } from "react";
// import axios from "axios";

// const Order = () => {
//   const navigate = useNavigate();
//   const { user, setUser,loading } = useAuth();
//   const [filter, setFilter] = useState("All");

//   useEffect(() => {
//     if(loading)return;
//     if (!user || !user.id) {
//       navigate("/login");
//     }
//   }, [user,loading, navigate]);
//   if (loading) {
//   return <p className="text-center mt-10 text-gray-600">Loading...</p>;
// }

//   if (!user || !user.id) return null;

//   const filteredOrders =
//     filter === "All"
//       ? user.orders
//       : user.orders.filter((order) => order.status === filter.toLowerCase());

//   const handleCancel = async (orderIndex) => {
//     const updatedOrders = [...user.orders];
//     updatedOrders[orderIndex].status = "cancelled";

//     try {
//       const updatedUser = {
//         ...user,
//         orders: updatedOrders,
//       };
//       await axios.patch(`http://localhost:3000/users/${user.id}`, updatedUser);

//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       setUser(updatedUser);
//       alert("Order cancelled successfully.");
//     } catch (error) {
//       console.error("Cancel error:", error);
//       alert("Failed to cancel order.");
//     }
//   };

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "pending":
//         return "bg-orange-100 text-orange-700";
//       case "cancelled":
//         return "bg-red-100 text-red-700";
//       case "delivered":
//         return "bg-green-100 text-green-700";
//       default:
//         return "bg-gray-200 text-gray-700";
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8">
//       <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
//          My Orders
//       </h2>

//       {/* Filter */}
//       <div className="flex justify-center gap-3 mb-6">
//         {["All", "Pending", "Cancelled", "Delivered"].map((status) => (
//           <button
//             key={status}
//             onClick={() => setFilter(status)}
//             className={`px-4 py-1 rounded-full text-sm font-medium border ${
//               filter === status
//                 ? "bg-purple-600 text-white border-purple-600"
//                 : "bg-white text-gray-700 border-gray-300"
//             }`}
//           >
//             {status}
//           </button>
//         ))}
//       </div>

//       {/* Orders */}
//       {filteredOrders.length === 0 ? (
//         <p className="text-center text-gray-600">
//           No orders found for {filter}.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {filteredOrders.map((order, index) => (
//             <div
//               key={index}
//               className="bg-white border shadow-md rounded-lg p-5 transition hover:shadow-xl"
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Order #{index + 1}
//                 </h3>
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
//                     order.status
//                   )}`}
//                 >
//                   {order.status}
//                 </span>
//               </div>

//               <p className="text-sm text-gray-600 mb-1">
//                 <strong>Date:</strong>{" "}
//                 {new Date(order.createdAt).toLocaleString()}
//               </p>
//               <p className="text-sm text-gray-600 mb-3">
//                 <strong>Total:</strong> ₹{order.total}
//               </p>

              
//               <div className="space-y-2">
//                 {order.items.map((item, i) => (
//                   <div key={i} className="flex items-center gap-3 border p-2 rounded">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-14 h-14 object-cover rounded"
//                     />
//                     <div>
//                       <p className="text-sm font-medium">{item.name}</p>
//                       <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
//                       <p className="text-xs text-gray-500">₹{item.price}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Cancel Button */}
//               {order.status === "pending" && (
//                 <button
//                   onClick={() => handleCancel(index)}
//                   className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
//                 >
//                   Cancel Order
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Order;



// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useEffect, useState } from "react";
// import axios from "axios";

// const Order = () => {
//   const navigate = useNavigate();
//   const { user, setUser, loading } = useAuth();
//   const [filter, setFilter] = useState("All");
//   const [loadingOrders, setLoadingOrders] = useState(true);

//   useEffect(() => {
//     if (loading) return;

//     if (!user || !user.id) {
//       navigate("/login");
//       return;
//     }

//     const fetchUserWithOrders = async () => {
//       try {
//         setLoadingOrders(true);
//         const res = await axios.get(`http://localhost:3000/users/${user.id}`);
//         setUser(res.data);
//       } catch (error) {
//         console.error("Failed to fetch updated user:", error);
//       } finally {
//         setLoadingOrders(false);
//       }
//     };

//     fetchUserWithOrders();
//   }, [user?.id, loading, navigate]);

//   if (loading || loadingOrders) {
//     return <p className="text-center mt-10 text-gray-600">Loading...</p>;
//   }

//   if (!user || !user.id) return null;

//   const filteredOrders =
//     filter === "All"
//       ? (user.orders || [])
//       : (user.orders || []).filter((order) => order.status === filter.toLowerCase());

//   const handleCancel = async (orderIndex) => {
//     const updatedOrders = [...user.orders];
//     updatedOrders[orderIndex].status = "cancelled";

//     try {
//       const updatedUser = {
//         ...user,
//         orders: updatedOrders,
//       };
//       await axios.patch(`http://localhost:3000/users/${user.id}`, updatedUser);

//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       setUser(updatedUser);
//       alert("Order cancelled successfully.");
//     } catch (error) {
//       console.error("Cancel error:", error);
//       alert("Failed to cancel order.");
//     }
//   };

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "pending":
//         return "bg-orange-100 text-orange-700";
//       case "cancelled":
//         return "bg-red-100 text-red-700";
//       case "delivered":
//         return "bg-green-100 text-green-700";
//       default:
//         return "bg-gray-200 text-gray-700";
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8">
//       <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
//         My Orders
//       </h2>

//       {/* Filter */}
//       <div className="flex justify-center gap-3 mb-6">
//         {["All", "Pending", "Cancelled", "Delivered"].map((status) => (
//           <button
//             key={status}
//             onClick={() => setFilter(status)}
//             className={`px-4 py-1 rounded-full text-sm font-medium border ${
//               filter === status
//                 ? "bg-purple-600 text-white border-purple-600"
//                 : "bg-white text-gray-700 border-gray-300"
//             }`}
//           >
//             {status}
//           </button>
//         ))}
//       </div>

//       {/* Orders */}
//       {filteredOrders.length === 0 ? (
//         <p className="text-center text-gray-600">
//           No orders found for {filter}.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {filteredOrders.map((order, index) => (
//             <div
//               key={index}
//               className="bg-white border shadow-md rounded-lg p-5 transition hover:shadow-xl"
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Order #{index + 1}
//                 </h3>
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
//                     order.status
//                   )}`}
//                 >
//                   {order.status}
//                 </span>
//               </div>

//               <p className="text-sm text-gray-600 mb-1">
//                 <strong>Date:</strong>{" "}
//                 {new Date(order.createdAt).toLocaleString()}
//               </p>
//               <p className="text-sm text-gray-600 mb-3">
//                 <strong>Total:</strong> ₹{order.total}
//               </p>

//               <div className="space-y-2">
//                 {order.items.map((item, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center gap-3 border p-2 rounded"
//                   >
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-14 h-14 object-cover rounded"
//                     />
//                     <div>
//                       <p className="text-sm font-medium">{item.name}</p>
//                       <p className="text-xs text-gray-500">
//                         Qty: {item.quantity}
//                       </p>
//                       <p className="text-xs text-gray-500">₹{item.price}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Cancel Button */}
//               {order.status === "pending" && (
//                 <button
//                   onClick={() => handleCancel(index)}
//                   className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
//                 >
//                   Cancel Order
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Order;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Order = () => {
  const { user, setUser, loading } = useAuth();
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user || !user.id) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/users/${user.id}`);
        setUser(res.data);
        setLoadingOrders(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user?.id, loading, navigate, setUser]);

  const handleCancel = async (index) => {
    const updatedOrders = [...user.orders];
    updatedOrders[index].status = "cancelled";

    try {
      const updatedUser = { ...user, orders: updatedOrders };
      await axios.patch(`http://localhost:3000/users/${user.id}`, updatedUser);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Order cancelled.");
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel.");
    }
  };

  if (loading || loadingOrders) {
    return <p className="text-center mt-10 text-gray-600 text-lg">Loading your orders...</p>;
  }

  if (!user || !user.orders || user.orders.length === 0) {
    return <p className="text-center mt-10 text-gray-600 text-lg">No orders found.</p>;
  }

  const filteredOrders =
    filter === "All"
      ? user.orders
      : user.orders.filter((order) => order.status === filter.toLowerCase());

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-300";
      case "delivered":
        return "bg-green-100 text-green-800 border border-green-300";
      default:
        return "bg-gray-200 text-gray-700 border border-gray-300";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-center mb-8 text-purple-800">🧾 My Orders</h2>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {["All", "Pending", "Cancelled", "Delivered"].map((status) => (
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
        ))}
      </div>

      {/* Order Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {filteredOrders.map((order, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 border hover:shadow-xl transition"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-purple-700">
                Order #{index + 1}
              </h3>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(order.status)}`}>
                {order.status}
              </span>
            </div>

            <p className="text-sm text-gray-600">
              <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <strong>Total:</strong> ₹{order.total}
            </p>

            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-center border rounded-lg p-3 bg-gray-50"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded object-cover border"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} • ₹{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {order.status === "pending" && (
              <button
                onClick={() => handleCancel(index)}
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
