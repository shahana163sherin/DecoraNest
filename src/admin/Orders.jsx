import { useEffect, useMemo, useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrdersAdmin = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [sortStatus, setSortStatus] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/users");
        setOrdersData(res.data);
      } catch (err) {
        console.error("Error in fetching orders", err);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, sortStatus]);

  const categories = useMemo(() => {
    const items = ordersData.flatMap((user) =>
      user.orders?.flatMap((order) => order.items) || []
    );
    const unique = new Set(items.map((item) => item.category));
    return ["All", ...unique];
  }, [ordersData]);

  const filteredOrders = useMemo(() => {
    const allOrders = ordersData
      .filter((user) => {
        const usernameMatch = user.name?.toLowerCase().includes(search.toLowerCase());
        
        return search === "" || usernameMatch;
      })
      .flatMap((user) =>
        (user.orders || []).map((order, index) => ({
          ...order,
          user,
          index,
        }))
      )
      .filter((order) =>
        selectedCategory === "All"
          ? true
          : order.items?.some((item) => item.category === selectedCategory)
      )
      .filter((order) =>
        sortStatus === "All" ? true : order.status === sortStatus.toLowerCase()
      );

    return allOrders.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
  }, [ordersData, selectedCategory, search, sortOrder, sortStatus]);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateStatus = async (userId, orderIndex, newStatus) => {
    try {
      const user = ordersData.find((u) => u.id === userId);
      const updatedOrders = [...user.orders];
      updatedOrders[orderIndex].status = newStatus;

      await axios.patch(`/users/${userId}`, { orders: updatedOrders });

      setOrdersData((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, orders: updatedOrders } : u
        )
      );
      toast.success("Order status updated!");
    } catch (err) {
      console.error("Error updating status", err);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteClick = (userId, orderIndex) => {
    setOrderToDelete({ userId, orderIndex });
    setShowDeleteModal(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;

    const { userId, orderIndex } = orderToDelete;

    try {
      const user = ordersData.find((u) => u.id === userId);
      const updatedOrders = [...user.orders];
      updatedOrders.splice(orderIndex, 1);

      await axios.patch(`/users/${userId}`, { orders: updatedOrders });

      setOrdersData((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, orders: updatedOrders } : u
        )
      );
      toast.success("Order deleted!");
    } catch (err) {
      console.error("Error deleting order", err);
      toast.error("Failed to delete order");
    } finally {
      setShowDeleteModal(false);
      setOrderToDelete(null);
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 text-xs font-bold uppercase rounded-full";
    const colors = {
      delivered: "bg-green-200 text-green-800",
      pending: "bg-yellow-200 text-yellow-800",
      processing: "bg-blue-200 text-blue-800",
      cancelled: "bg-red-200 text-red-800",
    };
    return <span className={`${base} ${colors[status] || "bg-gray-200"}`}>{status}</span>;
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">All Orders</h1>

      
      <div className="p-4 bg-white shadow-sm rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Orders</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">Search</label>
            <input
              type="text"
              placeholder="Username"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

       
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

        
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">Status</label>
            <select
              value={sortStatus}
              onChange={(e) => setSortStatus(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {["All", "Pending", "Processing", "Delivered", "Cancelled"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

         
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">Sort By</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      
      {paginatedOrders.map((order, index) => {
        const user = order.user;
        return (
          <div key={`${user.id}-${order.index}`} className="border p-4 rounded-xl shadow-md mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">Order #{index + 1}</h2>
                <p><strong>Customer:</strong> {user.name} ({user.email})</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(order.status)}
                {order.status !== "cancelled" && (
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(user.id, order.index, e.target.value)}
                    className="px-3 py-1 border rounded shadow-sm bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="delivered">Delivered</option>
                  </select>
                )}
                <button
                  onClick={() => handleDeleteClick(user.id, order.index)}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {order.items.map((item, i) => (
                <div key={i} className="bg-white p-4 rounded shadow-sm flex flex-col items-center">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover mb-2 rounded" />
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p>Qty: {item.quantity}</p>
                  <p className="font-bold text-green-700">₹{item.price}</p>
                </div>
              ))}
            </div>

            <div className="text-right mt-4 font-bold">Total: ₹{order.total}</div>
          </div>
        );
      })}

   
      {filteredOrders.length > itemsPerPage && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 font-semibold">
            Page {currentPage} of {Math.ceil(filteredOrders.length / itemsPerPage)}
          </span>
          <button
            disabled={currentPage === Math.ceil(filteredOrders.length / itemsPerPage)}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

   
      {showDeleteModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this order?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setOrderToDelete(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOrder}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;
