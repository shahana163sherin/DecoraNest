// import { useEffect,useState } from "react";
// import axios from "../api/axiosInstance"

// const Users = () =>{
//     const [users,setUsers]=useState([])
//     const[loading,setLoading]=useState(false)


//     const fetchUser = async ()=>{
//         try{
//             setLoading(true)
//             const res =await  axios.get("/users")
//             setUsers(res.data)
//             console.log("Fetched users:", res.data);
//         }
//         catch(err){
//             console.error("Error in fetching user",err)
//         }
//         finally{
//             setLoading(false)
//         }
        

//     }
    


// useEffect(()=>{
//    fetchUser();
// },[])

// const BlockToggle = async (user)=>{
//     try {
//         await axios.patch(`/users/${user.id}`,{
//             isBlock:!user.isBlock,
//         })
//         fetchUser();

//     }
//     catch (err){
//         console.error("Error in Updating",err)
//     }
   
// }
//    if(loading)return<h2>Loading....</h2>

// return(
//     <div>
//         <table>
//             <thead>
//             <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Role</th>
//                 <th>Status</th>
//                 <th>Action</th>
//             </tr>
//             </thead>
//             <tbody>
//                 {users.map((u)=>(
//                        <tr key={u.id}>
//                     <td>{u.name}</td>
//                     <td>{u.email}</td>
//                     <td>{u.role}</td>
//                     <td>{u.isBlock?"Blocked":"Active"}</td>
//                     <td>{u.role === "admin"?(
//                         <span>No Action</span>
//                     ):
//                     (
//                         <button onClick={()=>BlockToggle(u)}>
//                            {u.isBlock?"UnBlock":"Block"}

//                         </button>
//                     )}</td>
//                 </tr>
//                 )
             
//                 )}
//             </tbody>
           
//         </table>
//     </div>
    
// );
// }
// export default Users


import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { Trash2 } from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rolefilter,setRolefilter]=useState("All");
  const [blockfilter,setBlockfltr]=useState("All");
  const [search,setSearch]=useState("");

  //-------------paginationdata--------------------
  // const [currentPage,setCurrentPage]=useState(1);

  // const userPerPage=5;
  // const startIndex=(currentPage-1) * userPerPage;
  // const lastIndex= startIndex + userPerPage


  //----------------sort by date--------------

  const[sortDate,setSort]=useState("newest")

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/users");
      setUsers(res.data);
      console.log("Fetched users:", res.data);
    } catch (err) {
      console.error("Error in fetching user", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const BlockToggle = async (user) => {
    try {
      await axios.patch(`/users/${user.id}`, {
        isBlock: !user.isBlock,
      });
      fetchUser();
    } catch (err) {
      console.error("Error in Updating", err);
    }
  };
  const Delete = async (id) => {
    const confirm=window.confirm("Are you sure you want to delete the user")
    if(!confirm)return;
    try{
         await axios.delete(`/users/${id}`)
    setUsers((prev)=>prev.filter((u)=>u.id !== id))
    fetchUser();
    }
    catch(err){

        console.error("Error in deleting user",err)
    }
   

    
  }

  if (loading)
    return (
      <h2 className="text-center text-xl font-semibold text-blue-500 mt-10">
        Loading...
      </h2>
    );

   const getFilterdUsers = () => {

     let filtered= users.filter ((user)=>{
     
       const matchRole = rolefilter === "All" || user.role === rolefilter;
    const matchBlock = blockfilter === "All" || 
    blockfilter === "block" && user.isBlock === true || 
    blockfilter === "unblock" && user.isBlock === false;

    const matchSearch = user.email.toLowerCase().includes(search.toLowerCase())
    

    return matchRole && matchBlock && matchSearch
     });
     filtered.sort((a,b)=>{
      const dateA=new Date(a.createdAt)
      const dateB=new Date(b.createdAt)
      return sortDate === "newest" ? dateB - dateA : dateA - dateB;

     });
     return filtered;
   
   }

   const  FilterdUsers = getFilterdUsers();
  //  const paginatedUsers = FilterdUsers.slice(startIndex,lastIndex)
   


  return (
  <div className="p-4 sm:p-6 md:p-8">
    <h2 className="text-2xl font-bold mb-4 text-center">User Management</h2>
    
   
    <div className="flex flex-wrap gap-6 mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Filter by Role</label>
   <select className="px-4 py-2 border rounded text-purple-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
   value={rolefilter}
      onChange={(e) => setRolefilter(e.target.value)}
      // className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="All">All</option>
      <option value="admin">Admin</option>
      <option value="user">User</option>
    </select>
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
    <select className="px-4 py-2 border rounded text-purple-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      value={blockfilter}
      onChange={(e) => setBlockfltr(e.target.value)}
      // className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="All">All</option>
      <option value="block">Blocked</option>
      <option value="unblock">Unblocked</option>
    </select>
  </div>
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Sort By Date</label>
    <select className="px-4 py-2 border rounded text-purple-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      value={sortDate}
      onChange={(e) => setSort(e.target.value)}
      // className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      onChange={(e) => {
        setSearch(e.target.value);
        // setCurrentPage(1); // Reset to page 1 on search
      }}
      placeholder="Enter email..."
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full"
    />
  </div>
</div>

   
    <table className="min-w-full bg-white border border-gray-200 text-sm md:text-base">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="px-4 py-3 text-left">Name</th>
          <th className="px-4 py-3 text-left hidden sm:table-cell">Email</th>
          <th className="px-4 py-3 text-left hidden md:table-cell">Role</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-left">Action</th>
          <th className="px-4 py-3 text-left">Created Date</th>
          <th className="px-4 py-3 text-left"></th>
          

        </tr>
      </thead>
      <tbody>
        {FilterdUsers.length > 0 ? (
          FilterdUsers.map((u) => (
            <tr key={u.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-3">{u.name}</td>
              <td className="px-4 py-3 hidden sm:table-cell">{u.email}</td>
              <td className="px-4 py-3 capitalize hidden md:table-cell">{u.role}</td>
              <td className="px-4 py-3">
                {u.isBlock ? (
                  <span className="text-red-600 font-semibold">Blocked</span>
                ) : (
                  <span className="text-green-600 font-semibold">Active</span>
                )}
              </td>
              <td className="px-4 py-3">
                {u.role === "admin" ? (
                  <span className="text-gray-500 italic">No Action</span>
                ) : (
                  <button
                    onClick={() => BlockToggle(u)}
                    className={`px-3 py-1 rounded text-white text-sm ${
                      u.isBlock
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {u.isBlock ? "Unblock" : "Block"}
                  </button>
                )}
              </td>
              <td className="px-4 py-3">
                {new Date(u.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => Delete(u.id)}
                  title="Delete user"
                >
                  <Trash2 className="w-5 h-5 text-gray-600 hover:text-red-600 transition" />
                </button>
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
    {/* Pagination Controls */}
{/* <div className="flex justify-center items-center gap-2 mt-6">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
  >
    Prev
  </button>

  {Array.from({ length: Math.ceil(FilterdUsers.length / userPerPage) }, (_, i) => (
    <button
      key={i + 1}
      onClick={() => setCurrentPage(i + 1)}
      className={`px-3 py-1 rounded ${
        currentPage === i + 1 ? "bg-purple-500 text-white" : "bg-gray-200 hover:bg-gray-300"
      }`}
    >
      {i + 1}
    </button>
  ))}

  <button
    onClick={() =>
      setCurrentPage((prev) =>
        prev < Math.ceil(FilterdUsers.length / userPerPage) ? prev + 1 : prev
      )
    }
    disabled={currentPage === Math.ceil(FilterdUsers.length / userPerPage)}
    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
  >
    Next
  </button>
</div> */}

  </div>
);
};

export default Users;
