// import { createContext, useReducer,useContext } from "react";
// import { useEffect } from "react";


// const WishListContext = createContext();
// const initialState={
//     wishlist:JSON.parse(localStorage.getItem("wishlist")) || []
// }

// const reducer = (state,action) => {

//     switch(action.type){
//         case "AddToWish":
//           if(state.wishlist.find((item)=>item.id === action.payload.id))
//             return state;
//         return {...state,wishlist:[...state.wishlist,action.payload],}         
//         case "RemoveFromWish":
//             return{...state,
//                 wishlist:state.wishlist.filter((item)=>
//                 item.id !== action.payload)
//             }
//         case "ClearCart":
//             return {...state,wishlist:[]};
        
//         default:
//             return state;
//     }
// }

// const WishListProvider = ({children}) =>{

//     const [state,dispatch]=useReducer(reducer,initialState)

//      useEffect(() => {
//     localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
//   }, [state.wishlist]);

//     return (
//         <WishListContext.Provider value={{wishlist:state.wishlist,dispatch}}>
//             {children}
//         </WishListContext.Provider>
//     );

// }
// export const useWishList = () => useContext(WishListContext)
// export default WishListProvider



import { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const WishListContext = createContext();

const initialState = {
  wishlist: JSON.parse(localStorage.getItem("wishlist")) || []
};

const reducer = (state, action) => {
  switch (action.type) {
    case "AddToWish":
      if (state.wishlist.find((item) => item.id === action.payload.id)) return state;
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };

    case "RemoveFromWish":
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item.id !== action.payload),
      };

    case "ClearWish":
      return {
        ...state,
        wishlist: [],
      };

    default:
      return state;
  }
};

const WishListProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, setUser } = useAuth();

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(state.wishlist));

    const syncWishlist = async () => {
      if (user?.id) {
        try {
          await axios.patch(`http://localhost:3000/users/${user.id}`, {
            wishlist: state.wishlist,
          });
          const updatedUser = { ...user, wishlist: state.wishlist };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
        } catch (err) {
          console.error("Failed to sync wishlist:", err);
        }
      }
    };

    syncWishlist();
  }, [state.wishlist, user]);

  return (
    <WishListContext.Provider value={{ wishlist: state.wishlist, dispatch }}>
      {children}
    </WishListContext.Provider>
  );
};

export const useWishList = () => useContext(WishListContext);
export default WishListProvider;
