import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, dispatch } = useCart();
  console.log("Cart State:", cart);

  if (cart.length === 0) return <h2 className="text-center text-xl mt-10">🛒 Your cart is empty</h2>;

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">🛒 Your Cart</h2>

      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="p-4 border rounded shadow-sm flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">{item.name}</h3>
             <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />

              
              
              <button onClick={()=>dispatch({type:"DecQntity",payload:item.id})}
                 disabled={item.quantity <= 1}>-</button>
                 <span className="text-sm text-gray-600">{item.quantity}</span>
              <button onClick={()=>dispatch({type:"IncQuantity",payload:item.id})}>+</button>
              <p className="text-sm text-gray-800">Price: ₹{item.price}</p>
            </div>
            <button
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
              onClick={() => dispatch({ type: "RemoveFromCart", payload: item.id })}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right">
        <h2 className="text-xl font-bold">Total: ₹{total}</h2>
      </div>
    </div>
  );
};

export default Cart;
