import { useWishList } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { UpdatedWish } from "../services/WishListServices";

const Wishlist = () => {
  const { wishlist, dispatch: wishDispatch } = useWishList();
  const { cart, dispatch: cartDispatch } = useCart();
  const navigate = useNavigate();
  const [message, setMessage] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTimeout(()=>
        alert("please login"),2000
      )
      
      navigate("/login");
      return;
    }
  }, [user, navigate]);
 

  if (!user ) return null;
  if (wishlist.length === 0) return <h2 className="text-center text-xl font-semibold mt-10">Wishlist is Empty</h2>;

  const handleRemove = async (item) => {

    const updatedWishlist = wishlist.filter(w => w.id !== item.id);
    wishDispatch({ type: "RemoveFromWish", payload: item.id });
    await UpdatedWish(user.id, updatedWishlist);
    setMessage("Removed from wishlist");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleAddToCart = (item) => {
    cartDispatch({ type: "AddToCart", payload: item });
    setMessage("Added to cart");
    setTimeout(() => setMessage(""),2000);
    navigate("/cart");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded shadow-md z-50">
          {message}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 text-purple-800">Your Wishlist</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map((item) => {
          const inCart = cart.some((cartItem) => cartItem.id === item.id);
          return (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-48 w-full object-cover rounded mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-1">{item.category}</p>
              <p className="text-purple-600 font-bold mb-3">₹{item.price}</p>

              <div className="flex gap-2 mt-auto">
                {inCart ? (
                  <button
                    onClick={() => navigate("/cart")}
                    className="flex-1 bg-gray-200 text-gray-800 py-1 px-2 rounded hover:bg-gray-300"
                  >
                    Go to Cart
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-purple-600 text-white py-1 px-2 rounded hover:bg-purple-700"
                  >
                    Add to Cart
                  </button>
                )}
                <button
                  onClick={() => handleRemove(item)}
                  className="flex-1 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
