import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Trash2 } from "lucide-react";

import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState("All");
  const [blockFilter, setBlockFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortDate, setSortDate] = useState("newest");

  // ---------- Fetch Users ----------
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/AdminUsers/AllUsers");
      setUsers(res.data);
      console.log("Fetched users:", res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ---------- Block / Unblock ----------
const BlockToggle = async (user) => {
  try {
    const res = await axiosInstance.put("/admin/AdminUsers/BlockUnblock", {
      id: user.user_Id,
    });

    console.log("Block/Unblock response:", res.data);

    const status = res.data.message.toLowerCase(); // 'user blocked' or 'user unblocked'

    if (status.includes("blocked") && !status.includes("unblocked")) {
      console.log("block");
      toast.error("User has been Blocked 🚫");
    } else if (status.includes("unblocked")) {
      toast.success("User has been Unblocked ✅");
    } else {
      toast.info("User status updated");
    }

    fetchUsers();
  } catch (err) {
    console.error("Error while blocking/unblocking user:", err);
    toast.error("Failed to update user status ❌");
  }
};




 
  const getFilteredUsers = () => {
    let filtered = users.filter((user) => {
      const matchRole =
        roleFilter === "All" || user.role?.toLowerCase() === roleFilter.toLowerCase();

      const matchBlock =
        blockFilter === "All" ||
        (blockFilter === "block" && user.isBlocked === true) ||
        (blockFilter === "unblock" && user.isBlocked === false);

      const matchSearch =
        !search ||
        user.email?.toLowerCase().includes(search.toLowerCase());

      return matchRole && matchBlock && matchSearch;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortDate === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  if (loading)
    return (
      <h2 className="text-center text-xl font-semibold text-blue-500 mt-10">
        Loading...
      </h2>
    );

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-4 text-center">User Management</h2>

      {/* ---------- Filters ---------- */}
      <div className="flex flex-wrap gap-6 mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Filter by Role</label>
          <select
            className="px-4 py-2 border rounded text-purple-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select
            className="px-4 py-2 border rounded text-purple-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="block">Blocked</option>
            <option value="unblock">Unblocked</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Sort By Date</label>
          <select
            className="px-4 py-2 border rounded text-purple-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={sortDate}
            onChange={(e) => setSortDate(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        <div className="flex flex-col flex-grow">
          <label className="text-sm font-medium text-gray-700 mb-1">Search by E-mail</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter email..."
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
          />
        </div>
      </div>

      {/* ---------- Table ---------- */}
      <table className="min-w-full bg-white border border-gray-200 text-sm md:text-base">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left hidden sm:table-cell">Email</th>
            <th className="px-4 py-3 text-left hidden md:table-cell">Role</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Action</th>
            <th className="px-4 py-3 text-left">Created Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <tr key={u.User_Id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 hidden sm:table-cell">{u.email}</td>
                <td className="px-4 py-3 capitalize hidden md:table-cell">{u.role}</td>
                <td className="px-4 py-3">
                {u.isBlocked ? (
                    <span className="text-red-600 font-semibold">Blocked</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}

                </td>
                   <td className="px-4 py-3">
                {u.role === "Admin" ? (
                      <span className="text-gray-500 italic">No Action</span>
                      ) : (
                        <button
                          onClick={() => BlockToggle(u)}
                          className={`px-3 py-1 rounded text-white text-sm ${
                            u.isBlocked
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          {u.isBlocked ? "Unblock" : "Block"}
                        </button>
                      )}
                    </td>

                <td className="px-4 py-3">
                  {new Date(u.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
