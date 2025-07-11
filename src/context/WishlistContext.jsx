import { createContext, useReducer,useContext } from "react";
import { useEffect } from "react";


const WishListContext = createContext();
const initialState={
    wishlist:JSON.parse(localStorage.getItem("wishlist")) || []
}

const reducer = (state,action) => {

    switch(action.type){
        case "AddToWish":
          if(state.wishlist.find((item)=>item.id === action.payload.id))
            return state;
        return {...state,wishlist:[...state.wishlist,action.payload],}         
        case "RemoveFromWish":
            return{...state,
                wishlist:state.wishlist.filter((item)=>
                item.id !== action.payload)
            }
        case "ClearCart":
            return {...state,wishlist:[]};
        
        default:
            return state;
    }
}

const WishListProvider = ({children}) =>{

    const [state,dispatch]=useReducer(reducer,initialState)

     useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
  }, [state.wishlist]);

    return (
        <WishListContext.Provider value={{wishlist:state.wishlist,dispatch}}>
            {children}
        </WishListContext.Provider>
    );

}
export const useWishList = () => useContext(WishListContext)
export default WishListProvider