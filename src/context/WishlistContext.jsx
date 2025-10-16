import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getWishList } from "../services/WishListServices";
import axiosInstance from "../api/axiosInstance";
const WishListContext = createContext();

const initialState = {
  wishlist: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SetWishList":
      return { ...state, wishlist: action.payload };
      case "RemoveFromWish":
      return {
        ...state,
        wishlist: state.wishlist.filter(
          (item) => item.wishlistId !== action.payload
        ),
      };
    default:
      return state;
  }
};

export const WishListProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useAuth();

 
useEffect(() => {
  const fetchWishlist = async () => {
    if (!user) {
      dispatch({ type: "SetWishList", payload: [] });
      return;
    }

    try {
      const data = await getWishList();
      
      const mappedData = data.map(item => ({
        ...item,
        wishlistId: item.WishListID || item.wishlistId, 
      }));
      dispatch({ type: "SetWishList", payload: mappedData });
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      dispatch({ type: "SetWishList", payload: [] });
    }
  };

  fetchWishlist();
}, [user]);



  const toggleWishlistItem = async (product) => {
    if (!user) throw new Error("User not logged in");

    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post(
        `/users/Wishlist/toggle-wishlist`,
        { productId: product.productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

     
      let updatedWishlist = [...state.wishlist];

      const isInWishlist = state.wishlist.some(
        (w) => w.productId === product.productId
      );

      if (isInWishlist) {
        
        updatedWishlist = updatedWishlist.filter(
          (w) => w.productId !== product.productId
        );
      } else {
        
        updatedWishlist.push(res.data.wishlist);
      }

      dispatch({ type: "SetWishList", payload: updatedWishlist });
      return updatedWishlist;
    } catch (err) {
      console.error("Toggle wishlist error:", err);
      throw new Error(err.response?.data?.message || err.message || "Network error");
    }
  };

  return (
    <WishListContext.Provider
  value={{ wishlist: state.wishlist, dispatch, toggleWishlistItem }}
>

      {children}
    </WishListContext.Provider>
  );
};

export const useWishList = () => useContext(WishListContext);
export default WishListProvider;
