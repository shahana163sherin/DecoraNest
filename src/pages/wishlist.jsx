import { useWishList } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { removeFromWish} from "../services/WishListServices";


const Wishlist = () => {
  const { wishlist, dispatch: wishDispatch } = useWishList();
  const { cart,addItemToCart } = useCart();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { user } = useAuth();
    const [addedToCartIds, setAddedToCartIds] = useState([]);

  useEffect(() => {
    if (!user || user.role === "Admin") {
      alert("Please login");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;
  if (wishlist.length === 0) return <h2 className="text-center mt-10">Wishlist is empty</h2>;

 const handleRemove = async (item) => {
  if (!item.wishlistId) {
    console.error("Invalid wishlist item:", item);
    return;
  }

  try {
    const result = await removeFromWish(item.wishlistId);
  
    wishDispatch({ type: "RemoveFromWish", payload: item.wishlistId });
    setMessage(result.Message || "Removed from wishlist");
    setTimeout(() => setMessage(""), 2000);
  } catch (err) {
    console.error(err.message);
    setMessage(err.message);
    setTimeout(() => setMessage(""), 2000);
  }
};



const handleAddToCartFromWishlist = async (item) => {
  try {
 
    await addItemToCart(item.productId, 1);

   
    setAddedToCartIds((prev) => [...prev, item.productId]);

    setMessage(`${item.productName} added to cart!`);
    setTimeout(() => setMessage(""), 2000);
  } catch (err) {
    console.error("Error adding to cart from wishlist:", err.message);
    setMessage(err.response?.data?.message || err.message || "Network error");
    setTimeout(() => setMessage(""), 2000);
  }
};


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {message && <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded">{message}</div>}
      <h2 className="text-2xl font-bold mb-6 text-purple-800">Your Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map((item) => {
          const inCart = cart.some(ci => ci.productId  === item.productId || addedToCartIds.includes(item.productId));
          return (
            <div key={item.wishlistId} className="bg-white border rounded-lg shadow-md p-4 flex flex-col">
              <img src={item.imgUrl} alt={item.productName} className="h-48 w-full object-cover rounded mb-4" />
              <h3 className="text-lg font-semibold">{item.productName}</h3>
              <p className="text-purple-600 font-bold mb-3">₹{item.price}</p>
              <div className="flex gap-2 mt-auto">
                {inCart ? (
                  <button onClick={() => navigate("/cart")} className="flex-1 bg-gray-200 rounded py-1">Go to Cart</button>
                ) : (
                  <button onClick={() => handleAddToCartFromWishlist(item)} className="flex-1 bg-purple-600 text-white rounded py-1">Add to Cart</button>
                )}
                <button onClick={() => handleRemove(item)} className="flex-1 bg-red-500 text-white rounded py-1">Remove</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
