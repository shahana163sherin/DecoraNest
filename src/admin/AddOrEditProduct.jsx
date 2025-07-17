// import { useEffect, useState } from "react";
// import axios from "../api/axiosInstance";
// import { useParams } from "react-router";

// const AddOrEditProduct = () => {
//   const [form, setForm] = useState({
//     name: "",
//     image: "",
//     category: "",
//     price: "",
//     description: "",
//   });

//   const [addProductResult, setAddProductResult] = useState(null);
//   const [message, setMessage] = useState("");
//   const {id} = useParams();

//   const handleInputImage = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setForm((prev) => ({ ...prev, image: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newProduct = {
//       ...form,
//       createdAt : id? form.createdAt : new Date().toISOString(),
//     };
    
    
//             try{
//                 if(id){
//                      await axios.put(`/products/${id}`,newProduct)
//                 setMessage("Product Edited successfully")
//                 }
//                 else{
//                     addProductToServer(newProduct);
//                 }
               
//             }
//             catch(err){
//                 console.error(id?"Error in updating":"Error in adding")
//             }
        
//     };

//   const addProductToServer = async (product) => {
//     try {
//       const res = await axios.post("/products", product);
//       setAddProductResult(res.data);
//       setMessage(" Product added successfully!");

//       // Reset form
//       setForm({
//         name: "",
//         image: "",
//         category: "",
//         price: "",
//         description: "",
//       });

//       setTimeout(() => setMessage(""), 2000);
//     } catch (err) {
//       console.error("Error in adding product:", err);
//       setMessage(" Failed to add product.");
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//  useEffect(()=>{
//     if(id){
//        const fetchProductForEdit = async () =>{
//                try{
//                    const res=await axios.get(`/products/${id}`)
//                    setForm(res.data)

//                }
//                catch(err){
//                 console.error("Error in fetch for edit",err)
//                }
//        }
//         fetchProductForEdit();
//     }
   

   

//  },[id])

//   return (
//     <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
//       {message && (
//         <div
//           style={{
//             padding: "10px",
//             marginBottom: "10px",
//             backgroundColor: "#e6f4ea",
//             color: "#116b2f",
//             borderRadius: "5px",
//             textAlign: "center",
//           }}
//         >
//           {message}
//         </div>
//       )}

//       {id ? (<h1>Edit Product</h1>):(<h1>Add New Product</h1>)}

//       <form onSubmit={handleSubmit}>
//         <label>Name of product:</label>
//         <input
//           type="text"
//           placeholder="Name of product.."
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           required
//         />

//         <label>Image of product:</label>
//         <input type="file" accept="image/*" onChange={handleInputImage} />

//         {form.image && (
//           <img
//             src={form.image}
//             alt={form.name}
//             width={100}
//             height={100}
//             style={{ marginTop: "10px", borderRadius: "8px" }}
//           />
//         )}

//         <label>Category of product:</label>
//         <input
//           type="text"
//           placeholder="Category of product.."
//           value={form.category}
//           onChange={(e) => setForm({ ...form, category: e.target.value })}
//           required
//         />

//         <label>Price:</label>
//         <input
//           type="number"
//           placeholder="Price of product.."
//           value={form.price}
//           onChange={(e) => setForm({ ...form, price: e.target.value })}
//           required
//         />

//         <label>Description:</label>
//         <textarea
//           type="text"
//           placeholder="Description of product.."
//           value={form.description}
//           onChange={(e) => setForm({ ...form, description: e.target.value })}
//           required
//           rols={4}
//         />

//         <button
//           type="submit"
//           style={{
//             marginTop: "15px",
//             padding: "8px 16px",
//             backgroundColor: "#0b7d53",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//           }}
//         >
//           {id? "Update":"Add"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddOrEditProduct;


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";

const AddOrEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    image: "",
    category: "",
    price: "",
    description: "",
  });

  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      axios.get(`/products/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => {
          console.error("Error fetching product", err);
          toast.error("Failed to load product");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await axios.put(`/products/${id}`, form);
        toast.success("Product updated successfully!");
      } else {
        await axios.post("/products", {
          ...form,
          createdAt: new Date().toISOString(),
        });
        toast.success("Product added successfully!");
      }
      navigate("/admin/products");
    } catch (error) {
      console.error("Error saving product", error);
      toast.error("Failed to save product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 py-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEdit ? "Edit Product" : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input
            type="url"
            name="image"
            value={form.image}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            className="w-32 h-32 object-cover border rounded"
          />
        )}

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isEdit ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddOrEditProduct;


