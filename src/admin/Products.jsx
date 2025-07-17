// import { useEffect, useState } from "react";
// import axios from '../api/axiosInstance'
// import { useNavigate } from "react-router";

// const ProductsAdmin = () =>{

//     const [products,setProducts]=useState([]);
//     const navigate=useNavigate();

//     useEffect(()=> {
//        const fetchProducts=async()=>{

//         try{
             
//              const prodRes = await axios.get("/products")
//         setProducts(prodRes.data)
//         }
//         catch(err){
//             console.error("Erron in fetching product",err)
//         }
       
//        }
//        fetchProducts();
//        console.log(products)


//     },[])

    
// return(
// <div>
//     <button onClick={()=>navigate("/admin/product/add-product")}>Add Products</button>
//     <table>
//         <thead>
//             <tr>
//             <th>Image</th>
//             <th>Name</th>
//             <th>Category</th>
//             <th>Price</th>
//             <th>Created Date</th>
//             <th>Action</th>
//             </tr>
//         </thead>
//         <tbody>
//             {products.map((p)=>{
//                 return(
//                       <tr key={p.id}>
//                 <td><img src={p.image} alt={p.name}  width={50} height={50} /></td>
//                 <td>{p.name}</td>
//                 <td>{p.category}</td>
//                 <td>{p.price}</td>
//                 <td>{p.createdAt}</td>
//                 <td><button >delete</button>
//                 <button onClick={()=>navigate(`/admin/product/edit-product/${p.id}`)}>edit</button></td>
//             </tr>
//                 )})}
           
//         </tbody>
//     </table>
// </div>
// );
// }
// export default ProductsAdmin

import { useEffect, useState } from "react";
import axios from '../api/axiosInstance';
import { useNavigate } from "react-router";
import { Pencil, Trash2 } from "lucide-react";

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const prodRes = await axios.get("/products");
        setProducts(prodRes.data);
      } catch (err) {
        console.error("Error in fetching product", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <button
          onClick={() => navigate("/admin/product/add-product")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              {/* <th className="py-3 px-4">Created Date</th> */}
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                </td>
                <td className="py-3 px-4 capitalize">{p.name}</td>
                <td className="py-3 px-4 capitalize">{p.category}</td>
                <td className="py-3 px-4">₹{p.price}</td>
                {/* <td className="py-3 px-4 text-sm text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td> */}
                <td className="py-3 px-4 space-x-2">
                  <button
                    className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                    onClick={() => navigate(`/admin/product/edit-product/${p.id}`)}
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                    onClick={() => console.log("Delete logic goes here")}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsAdmin;


// import { useEffect, useState } from "react";
// import axios from "../api/axiosInstance";
// import { useNavigate } from "react-router";
// import { Pencil, Trash2 } from "lucide-react";

// // Modal Component
// const ConfirmModal = ({ isOpen, onClose, onConfirm, productName }) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-xl text-center">
//         <h3 className="text-lg font-semibold mb-4">Delete Product</h3>
//         <p className="mb-6">
//           Are you sure you want to delete <strong>{productName}</strong>?
//         </p>
//         <div className="flex justify-center gap-4">
//           <button
//             onClick={onConfirm}
//             className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
//           >
//             Yes, Delete
//           </button>
//           <button
//             onClick={onClose}
//             className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ProductsAdmin = () => {
//   const [products, setProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [categories, setCategories] = useState([]);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const limit = 5;

//   const navigate = useNavigate();

//   const fetchProducts = async () => {
//     try {
//       const query = `/products?_page=${currentPage}&_limit=${limit}&q=${searchTerm}&${
//         categoryFilter ? `category=${categoryFilter}&` : ""
//       }`;

//       const res = await axios.get(query);
//       const total = res.headers["x-total-count"];
//       setTotalProducts(Number(total));
//       setProducts(res.data);
//     } catch (err) {
//       console.error("Error fetching products", err);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get("/products");
//       const cats = [...new Set(res.data.map((p) => p.category))];
//       setCategories(cats);
//     } catch (err) {
//       console.error("Error fetching categories", err);
//     }
//   };

//   const handleConfirmDelete = async () => {
//     if (!selectedProduct) return;
//     try {
//       await axios.delete(`/products/${selectedProduct.id}`);
//       setShowModal(false);
//       setSelectedProduct(null);
//       fetchProducts();
//     } catch (err) {
//       console.error("Error deleting product:", err);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, [currentPage, searchTerm, categoryFilter]);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const totalPages = Math.ceil(totalProducts / limit);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">Product Management</h2>
//         <button
//           onClick={() => navigate("/admin/product/add-product")}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//         >
//           + Add Product
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name..."
//           className="border p-2 rounded w-60"
//           value={searchTerm}
//           onChange={(e) => {
//             setCurrentPage(1);
//             setSearchTerm(e.target.value);
//           }}
//         />
//         <select
//           value={categoryFilter}
//           onChange={(e) => {
//             setCategoryFilter(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="border p-2 rounded"
//         >
//           <option value="">All Categories</option>
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//           <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
//             <tr>
//               <th className="py-3 px-4">Image</th>
//               <th className="py-3 px-4">Name</th>
//               <th className="py-3 px-4">Category</th>
//               <th className="py-3 px-4">Price</th>
//               <th className="py-3 px-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((p) => (
//               <tr
//                 key={p.id}
//                 className="border-t border-gray-200 hover:bg-gray-50 transition"
//               >
//                 <td className="py-3 px-4">
//                   <img
//                     src={p.image}
//                     alt={p.name}
//                     className="w-20 h-20 object-cover rounded"
//                   />
//                 </td>
//                 <td className="py-3 px-4 capitalize">{p.name}</td>
//                 <td className="py-3 px-4 capitalize">{p.category}</td>
//                 <td className="py-3 px-4">₹{p.price}</td>
//                 <td className="py-3 px-4 space-x-2">
//                   <button
//                     className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
//                     onClick={() => navigate(`/admin/product/edit-product/${p.id}`)}
//                     title="Edit"
//                   >
//                     <Pencil size={16} />
//                   </button>
//                   <button
//                     className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
//                     onClick={() => {
//                       setSelectedProduct(p);
//                       setShowModal(true);
//                     }}
//                     title="Delete"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className="flex justify-center mt-6 space-x-2">
//           {Array.from({ length: totalPages }).map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`px-3 py-1 rounded ${
//                 currentPage === i + 1
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-500 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>
//       </div>

//       <ConfirmModal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         onConfirm={handleConfirmDelete}
//         productName={selectedProduct?.name}
//       />
//     </div>
//   );
// };

// export default ProductsAdmin;


// import { useEffect, useState } from "react";
// import axios from "../api/axiosInstance";
// import { useNavigate } from "react-router";
// import { Pencil, Trash2 } from "lucide-react";

// const ProductsAdmin = () => {
//   const [products, setProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const limit = 5;

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get(`/products?_page=${currentPage}&_limit=${limit}`);
//         setProducts(res.data);

//         const totalCount = res.headers["x-total-count"];
//         if (totalCount) {
//           setTotalProducts(Number(totalCount));
//         }
//       } catch (err) {
//         console.error("Error in fetching products", err);
//       }
//       console.log("x-total-count:", res.headers["x-total-count"]);

//     };
//     fetchProducts();
//   }, [currentPage]);

//   const totalPages = Math.ceil(totalProducts / limit);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Product Management</h2>
//         <button
//           onClick={() => navigate("/admin/product/add-product")}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//         >
//           + Add Product
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//           <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
//             <tr>
//               <th className="py-3 px-4">Image</th>
//               <th className="py-3 px-4">Name</th>
//               <th className="py-3 px-4">Category</th>
//               <th className="py-3 px-4">Price</th>
//               <th className="py-3 px-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((p) => (
//               <tr
//                 key={p.id}
//                 className="border-t border-gray-200 hover:bg-gray-50 transition"
//               >
//                 <td className="py-3 px-4">
//                   <img
//                     src={p.image}
//                     alt={p.name}
//                     className="w-20 h-20 object-cover rounded"
//                   />
//                 </td>
//                 <td className="py-3 px-4 capitalize">{p.name}</td>
//                 <td className="py-3 px-4 capitalize">{p.category}</td>
//                 <td className="py-3 px-4">₹{p.price}</td>
//                 <td className="py-3 px-4 space-x-2">
//                   <button
//                     className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
//                     onClick={() => navigate(`/admin/product/edit-product/${p.id}`)}
//                     title="Edit"
//                   >
//                     <Pencil size={16} />
//                   </button>
//                   <button
//                     className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
//                     onClick={() => console.log("Delete logic goes here")}
//                     title="Delete"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Buttons */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-6 space-x-2">
//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`px-4 py-2 rounded ${
//                 currentPage === i + 1
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductsAdmin;
