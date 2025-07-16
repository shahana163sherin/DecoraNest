import { useEffect, useState } from "react";
import axios from '../api/axiosInstance'

const ProductsAdmin = () =>{

    const [products,setProducts]=useState([]);

    useEffect(()=> {
       const fetchProducts=async()=>{

        try{
             
             const prodRes = await axios.get("/products")
        setProducts(prodRes.data)
        }
        catch(err){
            console.error("Erron in fetching product",err)
        }
       
       }
       fetchProducts();
       console.log(products)


    },[])


//      const Handledelete = async (id) => {
//     const confirm=window.confirm("Are you sure you want to delete the user")
//     if(!confirm)return;
//     try{
//          await axios.delete(`/products/${id}`)
//     setProducts((prev)=>prev.filter((u)=>u.id !== id))
//     fetchProducts();
//     }
//     catch(err){

//         console.error("Error in deleting user",err)
//     }
   

    
//   }
return(
<div>
    <table>
        <thead>
            <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            {/* <th>Stock</th> */}
            <th>Created Date</th>
            <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {products.map((p)=>{
                return(
                      <tr key={p.id}>
                <td><img src={p.image} alt={p.name}  width={50} height={50} /></td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.price}</td>
                {/* <td>{p.stock}</td> */}
                <td>{p.createdAt}</td>
                <td><button onClick={Handledelete}>delete</button>
                <button>edit</button></td>
            </tr>
                )})}
           
        </tbody>
    </table>
</div>
);
}
export default ProductsAdmin

