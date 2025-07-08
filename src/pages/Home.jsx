import Hero from "../components/Hero";
import Featured from "../components/Featured";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productServices";
import ProductList from '../components/ProductList'
const Home = () =>{

    const [products,setProducts]=useState([]);

    useEffect(()=>{
        getAllProducts()
        .then(res=>setProducts(res.data))
        .catch(err=>console.error("Error in fetching",err))
    },[])

return (
   <div>
    <Hero/>
     <Featured products={products}/>
     

      <ProductList products={products}/>
      <Footer/>
    </div>
  );

}
export default Home


