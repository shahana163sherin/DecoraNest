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

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-4 text-center">User Management</h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200 text-sm md:text-base">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">Email</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 hidden sm:table-cell">{u.email}</td>
                <td className="px-4 py-3 capitalize hidden md:table-cell">
                  {u.role}
                </td>
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
                  <td>

                  <button
                   onClick={()=>Delete(u.id)}
                   title="Delete user"
                  ><Trash2 className="w-5 h-5 text-gray-600 hover:text-red-600 transition" /></button>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
