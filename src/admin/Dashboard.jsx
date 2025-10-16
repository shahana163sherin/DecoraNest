import { useEffect, useState } from "react";
import { Clock, CheckCircle, UserCheck } from "lucide-react";
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import axiosInstance from "../api/axiosInstance";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get("/admin/DashBoard");
        setDashboard(res.data.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading dashboard...</p>;
  if (!dashboard) return <p className="text-center mt-20">No data available</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
        <div className="bg-white p-4 rounded-2xl shadow-md text-center">
          <p className="text-xl font-semibold text-gray-700">Total Users</p>
          <p className="text-3xl font-bold text-blue-600">{dashboard.totalUsers}</p>
          <p className="mt-2 flex items-center justify-center gap-2 text-sm text-green-600 animate-pulse">
            <UserCheck className="w-4 h-4" /> Active Users: {dashboard.activeUsers}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md text-center">
          <p className="text-xl font-semibold text-gray-700">Total Orders</p>
          <p className="text-3xl font-bold text-green-600">{dashboard.totalOrders}</p>
          <div className="mt-3 flex flex-col gap-1 text-sm text-gray-600 items-center">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-orange-500 animate-pulse" /> Pending: {dashboard.pendingOrders}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-500 animate-bounce" /> Delivered: {dashboard.deliveredOrders}
            </span>
          </div>
        </div>

      
        <div className="bg-white p-4 rounded-2xl shadow-md text-center">
          <p className="text-xl font-semibold text-gray-700">Total Products</p>
          <p className="text-3xl font-bold text-purple-600">{dashboard.totalProducts}</p>
        </div>

      
        <div className="bg-white p-4 rounded-2xl shadow-md text-center">
          <p className="text-xl font-semibold text-gray-700">Total Revenue</p>
          <p className="text-3xl font-bold text-yellow-600">₹{dashboard.totalRevenue}</p>
        </div>
      </div>

      <div className="w-full h-[300px] bg-white p-4 rounded-2xl shadow-md mt-6">
        <h3 className="text-xl font-semibold mb-4 text-center">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dashboard.monthlyRevenues}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4ade80"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

     
      <div className="w-full h-[350px] bg-white p-6 rounded-2xl shadow-lg mt-10">
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-700">Top-Selling Products</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dashboard.topSellingProducts}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 50, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="productName" type="category" tick={{ fontSize: 14 }} />
            <Tooltip formatter={(value) => [value, "Units Sold"]} />
            <Legend />
            <Bar dataKey="totalSold" fill="#271581ff" barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
