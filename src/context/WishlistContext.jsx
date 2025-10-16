// import { createContext, useReducer, useContext, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "./AuthContext";

// const WishListContext = createContext();

// const initialState = {
//   wishlist: JSON.parse(localStorage.getItem("wishlist")) || []
// };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "AddToWish":
//       if (state.wishlist.find((item) => item.id === action.payload.id)) return state;
//       return {
//         ...state,
//         wishlist: [...state.wishlist, action.payload],
//       };

//     case "RemoveFromWish":
//       return {
//         ...state,
//         wishlist: state.wishlist.filter((item) => item.id !== action.payload),
//       };

//     case "ClearWish":
//       return {
//         ...state,
//         wishlist: [],
//       };

//     default:
//       return state;
//   }
// };

// const WishListProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const { user, setUser } = useAuth();

//   useEffect(() => {
//     localStorage.setItem("wishlist", JSON.stringify(state.wishlist));

//     const syncWishlist = async () => {
//       if (user?.id) {
//         try {
//           await axios.patch(`http://localhost:3000/users/${user.id}`, {
//             wishlist: state.wishlist,
//           });
//           const updatedUser = { ...user, wishlist: state.wishlist };
//           localStorage.setItem("user", JSON.stringify(updatedUser));
//           setUser(updatedUser);
//         } catch (err) {
//           console.error("Failed to sync wishlist:", err);
//         }
//       }
//     };

//     syncWishlist();
//   }, [state.wishlist, user]);

//   return (
//     <WishListContext.Provider value={{ wishlist: state.wishlist, dispatch }}>
//       {children}
//     </WishListContext.Provider>
//   );
// };

// export const useWishList = () => useContext(WishListContext);
// export default WishListProvider;



import { createContext, useContext, useReducer, useEffect } from "react";
// import axios from "axios"; // make sure baseURL is http://localhost:5094/api/v1
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
      // Ensure all items have 'wishlistId' (lowercase)
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



  // Toggle wishlist item
  const toggleWishlistItem = async (product) => {
    if (!user) throw new Error("User not logged in");

    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post(
        `/users/Wishlist/toggle-wishlist`,
        { productId: product.productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Backend returns updated item or empty list if removed
      let updatedWishlist = [...state.wishlist];

      const isInWishlist = state.wishlist.some(
        (w) => w.productId === product.productId
      );

      if (isInWishlist) {
        // removed
        updatedWishlist = updatedWishlist.filter(
          (w) => w.productId !== product.productId
        );
      } else {
        // added
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
    // <WishListContext.Provider
    //   value={{ wishlist: state.wishlist, toggleWishlistItem }}
    // >
    <WishListContext.Provider
  value={{ wishlist: state.wishlist, dispatch, toggleWishlistItem }}
>

      {children}
    </WishListContext.Provider>
  );
};

export const useWishList = () => useContext(WishListContext);
export default WishListProvider;
