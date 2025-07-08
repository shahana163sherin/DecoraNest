import ProductCard from './ProductCard'
const Featured = ({products}) =>{

    const ftr=products.slice(0,3)


return (
    <section className="py-10 bg-white text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Featured Products</h2>
        <div className="flex justify-center flex-wrap gap-6 px-4">
            {ftr.map((product)=>  <ProductCard  key ={product.id}product={product}/>)}
        </div>
    
       

    </section>
);
}
export default Featured