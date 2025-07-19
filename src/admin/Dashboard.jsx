import { useEffect, useState,useMemo } from "react";
import axios from '../api/axiosInstance'
import { Clock, CheckCircle,UserCheck} from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,Legend} from "recharts";




const Dashboard = () =>{

    const[users,setUsers]=useState([]);
    const[products,setProducts]=useState([]);


    useEffect(()=>{
        const fetchdata = async ()=>{
            try{
                const [userRes,productRes]=await Promise.all([
                     axios.get("/users"),
                     axios.get("/products")
                ])
               
              
                setUsers(userRes.data)
                setProducts(productRes.data)
            }
            catch(err){
                console.error("Error in dashboard",err)
            }
        }
        fetchdata();
    },[])

const ActiveTotal=users.filter((ac)=>ac.isBlock === false);
const Allorders=users.flatMap((user)=> user.orders || []);
const TotalRevenue=Allorders.reduce((sum,order)=>sum + order.total,0);
const pendingOrders=Allorders.filter((order)=>order.status === "pending")
const completedOrders=Allorders.filter((order)=>order.status === "delivered")

const monthlyRevenueData = useMemo(() => {
  const monthMap = {};

  Allorders.forEach(order => {
    if (order.status === "delivered") {
      const month = format(parseISO(order.createdAt), "MMM yyyy"); // e.g. "Jul 2025"
      if (!monthMap[month]) {
        monthMap[month] = 0;
      }
      monthMap[month] += order.total;
    }
  });

 
  return Object.entries(monthMap).map(([month, revenue]) => ({
    month,
    revenue
  }));
}, [Allorders]);


const topProducts = useMemo(() => {
  const productMap = {};

  Allorders.forEach(order => {
    if (order.status === "delivered") {
      (order.items || []).forEach(item => {
        if (!productMap[item.name]) {
          productMap[item.name] = 0;
        }
        productMap[item.name] += item.price * item.quantity;
      });
    }
  });

 
  return Object.entries(productMap)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5); 
}, [Allorders]);


    

return(
  <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
  <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  
    <div className="bg-white p-4 rounded-2xl shadow-md text-center">
      <p className="text-xl font-semibold text-gray-700">Total Users</p>
      <p className="text-3xl font-bold text-blue-600">{users.length}</p>
      <p className="mt-2 flex items-center justify-center gap-2 text-sm text-green-600 animate-pulse">
  <UserCheck className="w-4 h-4" />
  Active Users: {ActiveTotal.length}
</p>

    </div>


    
<div className="bg-white p-4 rounded-2xl shadow-md text-center">
  <p className="text-xl font-semibold text-gray-700">Total Orders</p>
  <p className="text-3xl font-bold text-green-600">{Allorders.length}</p>
  
  <div className="mt-3 flex flex-col gap-1 text-sm text-gray-600 items-center">
   <span className="flex items-center gap-1">
  <Clock className="w-4 h-4 text-orange-500 animate-pulse" /> Pending: {pendingOrders.length}
</span>
<span className="flex items-center gap-1">
  <CheckCircle className="w-4 h-4 text-emerald-500 animate-bounce" /> Delivered: {completedOrders.length}
</span>

  </div>
</div>


    <div className="bg-white p-4 rounded-2xl shadow-md text-center">
      <p className="text-xl font-semibold text-gray-700">Total Products</p>
      <p className="text-3xl font-bold text-purple-600">{products.length}</p>
    </div>

    
    <div className="bg-white p-4 rounded-2xl shadow-md text-center">
      <p className="text-xl font-semibold text-gray-700">Total Revenue</p>
      <p className="text-3xl font-bold text-yellow-600">₹{TotalRevenue}</p>
    </div>
  </div>
  <div>
  <div className="w-full h-[300px] bg-white p-4 rounded-2xl shadow-md">
  <h3 className="text-xl font-semibold mb-4 text-center">Monthly Revenue</h3>
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={monthlyRevenueData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
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
</div>


<div className="w-full h-[350px] bg-white p-6 rounded-2xl shadow-lg mt-10">
  <h3 className="text-2xl font-bold mb-6 text-center text-gray-700"> Top-Selling Products</h3>

  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={topProducts} layout="vertical" margin={{ top: 10, right: 30, left: 50, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" tick={{ fontSize: 14 }} />
      <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
      <Legend />
      <Bar dataKey="revenue" fill="#0e488fff" barSize={25} />
    </BarChart>
  </ResponsiveContainer>
</div>



</div>

);
}
export default Dashboard