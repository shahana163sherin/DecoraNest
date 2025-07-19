import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Menu,LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {Logout}=useAuth();
  const navigate=useNavigate();

  function handleLogout(){
   Logout()
    navigate("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden">
   
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-72 bg-gradient-to-b from-blue-200 to-green-100 text-gray-800 p-6 shadow-lg transform transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-600"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col space-y-4 text-lg">
          {[
            { to: "dashboard", label: "Dashboard" },
            { to: "orderadmin", label: "Orders" },
            { to: "product", label: "Products" },
            { to: "users", label: "Users" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 rounded-md ${
                  isActive
                    ? "bg-white font-semibold text-blue-700 shadow"
                    : "hover:bg-white hover:text-blue-800"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      <button
  onClick={handleLogout}
  className="mt-6 flex items-center gap-2 px-4 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition duration-200"
>
  <LogOut className="w-4 h-4" />
  Logout
</button>

      </aside>

    
    <div className="flex-1 overflow-auto">
     
        <div className="md:hidden p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-800"
          >
            <Menu />
          </button>
        </div>
        

        <main className="p-4 md:p-8 min-h-screen">
          <Outlet />
        </main>
      </div>
      </div>
    
  );
};

export default AdminLayout;
