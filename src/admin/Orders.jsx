import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrdersAdmin = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const itemsPerPage = 5;

  const fetchOrders = async (page = 1) => {
    try {
      const params = { pagenumber: page, limit: itemsPerPage };
      const res = await axiosInstance.get("/admin/order/AllOrder", { params });
      setOrdersData(res.data.items);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    } catch (err) {
      console.error("Error fetching orders", err);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axiosInstance.put("/admin/order/updateStatus", { id: orderId, status: newStatus });
      toast.success("Order status updated!");
      fetchOrders(currentPage);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axiosInstance.delete(`/admin/order/deleteOrder?orderid=${orderId}`);
      toast.success("Order deleted!");
      fetchOrders(currentPage);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order");
    }
  };

  const filteredOrders = ordersData
    .filter(
      (o) =>
        (search === "" || o.username.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter === "All" || o.status.toLowerCase() === statusFilter.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.orderDate) - new Date(a.orderDate)
        : new Date(a.orderDate) - new Date(b.orderDate)
    );

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

  const getPaymentBadge = (paymentStatus) => {
    const base = "px-3 py-1 text-xs font-bold uppercase rounded-full";
    const colors = {
      success: "bg-green-200 text-green-800",
      failed: "bg-red-200 text-red-800",
      pending: "bg-yellow-200 text-yellow-800",
    };
    return (
      <span className={`${base} ${colors[paymentStatus?.toLowerCase()] || "bg-gray-200"}`}>
        {paymentStatus || "Unknown"}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">All Orders</h1>

    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded shadow-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded shadow-sm"
        >
          {["All", "Pending", "Processing", "Delivered", "Cancelled"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded shadow-sm"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {filteredOrders.map((order) => (
        <div key={order.orderId} className="border p-4 rounded-xl shadow-md mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">Order #{order.ordeId}</h2>
              <p>
                <strong>Customer:</strong> {order.username} ({order.email})
              </p>
              <p>
                <strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(order.status)}
             

              {order.status !== "Cancelled" && (
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.ordeId, e.target.value)}
                  className="px-3 py-1 border rounded shadow-sm bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                </select>
              )}
               Payment:{getPaymentBadge(order.paymentStatus)}

              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setShowDeleteModal(true);
                }}
                className="text-red-600 font-semibold hover:underline"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {order.items.map((item, i) => (
              <div key={i} className="bg-white p-4 rounded shadow-sm flex flex-col items-center">
                <img
                  src={item.imgUrl}
                  alt={item.productName}
                  className="w-24 h-24 object-cover mb-2 rounded"
                />
                <p className="font-semibold">{item.productName}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p>Qty: {item.quantity}</p>
                <p className="font-bold text-green-700">₹{item.price}</p>
              </div>
            ))}
          </div>

          <div className="text-right mt-4 font-bold">Total: ₹{order.totalAmount}</div>
        </div>
      ))}

    
      {showDeleteModal && selectedOrder && (
        <div className="fixed inset-0 bg-blur bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg w-80 flex flex-col items-center">
            
            
            <svg
              className="w-16 h-16 mb-4 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.29 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L13.71 3.86a1 1 0 00-1.72 0zM12 9v4m0 4h.01"
              />
            </svg>

           
            <p className="text-center mb-6 text-sm">
              Are you sure you want to delete order <strong>#{selectedOrder.ordeId}</strong>?
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-white text-red-600 font-semibold rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteOrder(selectedOrder.ordeId);
                  setShowDeleteModal(false);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 bg-white text-red-600 font-semibold rounded hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;
