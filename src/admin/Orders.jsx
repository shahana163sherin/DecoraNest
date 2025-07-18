import { useEffect, useMemo, useState } from "react";
import axios from "../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrdersAdmin = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const[sortStatus,setSortStatus]=useState("All")

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/users");
      setOrdersData(res.data);
    } catch (err) {
      toast.error("Failed to fetch orders");
      console.error("Error:", err);
    }
  };

  const categories = useMemo(() => {
    const allItems = ordersData.flatMap(user =>
      user.orders?.flatMap(order => order.items) || []
    );
    const unique = new Set(allItems.map(item => item.category));
    return ["All", ...unique];
  }, [ordersData]);

  const filteredOrders = useMemo(() => {
    const allOrders = ordersData
      .filter(user => {
        const usernameMatch = user.name?.toLowerCase().includes(search.toLowerCase());
        const productMatch = user.orders?.some(order =>
          order.items?.some(item =>
            item.name?.toLowerCase().includes(search.toLowerCase())
          )
        );
        return search === "" || usernameMatch || productMatch;
      })
      .flatMap(user =>
        (user.orders || []).map((order, index) => ({
          ...order,
          user,
          index
        }))
      )
      .filter(order =>
        selectedCategory === "All"
          ? true
          : order.items?.some(item => item.category === selectedCategory)
      )

      .filter(order=>sortStatus === "All"?
        true:
        order.status === sortStatus.toLowerCase()
        
      )

    return allOrders.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
  }, [ordersData, selectedCategory, search, sortOrder,sortStatus]);


 

  const updateStatus = async (userId, orderIndex, newStatus) => {
    const confirm = window.confirm(`Change status to ${newStatus}?`);
    if (!confirm) return;

    try {
      const user = ordersData.find(u => u.id === userId);
      const updatedOrders = [...user.orders];
      updatedOrders[orderIndex].status = newStatus;

      await axios.patch(`/users/${userId}`, { orders: updatedOrders });
      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const deleteOrder = async (userId, orderIndex) => {
    const confirm = window.confirm("Are you sure you want to delete this order?");
    if (!confirm) return;

    try {
      const user = ordersData.find(u => u.id === userId);
      const updatedOrders = [...user.orders];
      updatedOrders.splice(orderIndex, 1);

      await axios.patch(`/users/${userId}`, { orders: updatedOrders });
      toast.success("Order deleted");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to delete order");
    }
  };

  const getStatusBadge = (status) => {
    const baseClass = "px-3 py-1 text-xs font-bold uppercase rounded-full";
    switch (status) {
      case "delivered":
        return <span className={`${baseClass} bg-green-200 text-green-800`}>Delivered</span>;
      case "pending":
        return <span className={`${baseClass} bg-yellow-200 text-yellow-800`}>Pending</span>;
      case "processing":
        return <span className={`${baseClass} bg-blue-200 text-blue-800`}>Processing</span>;
      case "cancelled":
            return <span className={`${baseClass} bg-red-200 text-red-800`}>Cancelled</span>;

      default:
        return <span className={`${baseClass} bg-gray-200 text-gray-700`}>{status}</span>;
    }
  };

  const cardColors = ["bg-blue-50", "bg-purple-50", "bg-orange-50", "bg-teal-50"];

  return (
    <div className="p-6 space-y-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Orders</h1>

      {/* Filters */}
      <input
        type="text"
        placeholder="Search by username or product name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-4 py-2 rounded w-full max-w-md mb-4 shadow-sm focus:outline-none focus:ring focus:border-blue-500"
      />
      <div className="flex gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-4 py-2 rounded focus:ring focus:border-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border px-4 py-2 rounded  focus:ring focus:border-blue-500"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>

         <select
          value={sortStatus}
          onChange={(e) => setSortStatus(e.target.value)}
          className="border px-4 py-2 rounded  focus:ring focus:border-blue-500"
        >
          <option value="All">All</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="processing">Processing</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* Orders */}
      {filteredOrders.map((order, index) => {
        const cardColor = cardColors[index % cardColors.length];
        const user = order.user;

        return (
          <div
            key={`${user.id}-order-${index}`}
            className={`${cardColor} border border-gray-300 rounded-xl p-6 shadow-md transition hover:shadow-lg`}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">Order #{index + 1}</h2>
                <p className="text-sm text-gray-700">
                  <strong>Customer:</strong> {user.name} ({user.email})
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div>{getStatusBadge(order.status)}</div>
             </div>

            {/* Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {order.items.map((item, i) => (
                <div
                  key={`${user.id}-item-${i}`}
                  className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center"
                >
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded mb-3" />
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p>Qty: {item.quantity}</p>
                  <p className="font-bold text-green-600">₹{item.price}</p>
                </div>
              ))}
            </div>

            {/* Total + Actions */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-bold text-gray-800">
                Total: ₹{order.total}
              </span>
              <div className="flex gap-3 items-center">
               <span>
                 {order.status !== "cancelled" && (
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(user.id, order.index, e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-gray-700 bg-white hover:cursor-pointer transition-all"
                  >
                    <option value="pending" className="text-yellow-600">Pending</option>
                    <option value="processing" className="text-blue-600">Processing</option>
                    <option value="delivered" className="text-green-600">Delivered</option>
                  </select>
                )}</span>
                <button
                  onClick={() => deleteOrder(user.id, order.index)}
                  className="px-3 py-1 text-red-600 border border-red-300 hover:bg-red-100 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersAdmin;

