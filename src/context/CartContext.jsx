// import { createContext, useReducer,useContext,useEffect } from "react";
// import {useAuth} from './AuthContext'
// import axios from "axios";

// const CartContext = createContext();

// const initialstate={
//    cart: JSON.parse(localStorage.getItem("cart")) || []
   
// }

// const reducer = (state,action) => {
         
//     switch(action.type){
//         case "AddToCart":
//             const exist = state.cart.find((item)=>item.id === action.payload.id)
//             if(exist){
//                return {...state,
//                 cart:state.cart.map((item)=>
//                     item.id === action.payload.id ?{...item,quantity:item.quantity+1}:item
//                 ),
//                };
                
//             }
//             return{...state,
//                 cart:[...state.cart,{...action.payload,quantity:1}],
               
//             };
           
//         case "RemoveFromCart":
//             return {...state,
//                 cart:state.cart.filter((item)=>item.id !== action.payload),
//             };
//         case "ClearCart":
//             return {...state,
//                 cart:[]
//             }
//         case "IncQuantity":
//                 return {...state,cart:state.cart.map(item =>
//                      item.id === action.payload ? { ...item, quantity: item.quantity + 1 }: item)}   
//        case "DecQntity":
//             return {...state,cart:state.cart.map((item)=>item.id === action.payload && item.quantity > 1 ?
//          {...item , quantity:item.quantity-1}:item)}
//         default :
//         return state;

//     }
// }

//     export const CartProvider = ({children}) => {

//         const {user,setUser}=useAuth()


//         const [state,dispatch]=useReducer(reducer,initialstate)

        
//         useEffect(()=>{

//             localStorage.setItem("cart",JSON.stringify(state.cart))

//             const Sync = async ()=>{
//                  if (user && user.id){
//                     try{
//                     await axios.patch(`http://localhost:3000/users/${user.id}`,{
//                      cart:state.cart})
//                     const updatedUser={...user,cart:state.cart}
//                     localStorage.setItem("user",JSON.stringify(updatedUser))
//                     setUser(updatedUser)
//                         }
//                     catch (err){
//                         console.error("Error in updating",err)
//                     }
               
//             }
//             }
//             Sync();
           


//         },[state.cart,user])
//         return (
//             <>
//             <CartContext.Provider value={{cart:state.cart,dispatch}}>
//                 {children}
//             </CartContext.Provider>
//             </>
//         );

//     }
//     export const useCart=()=>useContext(CartContext);
// src/context/CartContext.jsx
import React, { createContext, useReducer, useContext, useEffect } from "react";
import {
  addToCart ,
  getCartItems ,
  removeCartItems ,
  clearCartItem ,
  handleQuantityChange ,
} from "../services/cartService";

const CartContext = createContext();

const initialState = {
  cart: [],
};

function reduceCartItemsFromResponse(res) {
  // Accept many shapes: direct cart object, wrapped in data/Data, etc.
  // Return an array of cart items, or [].
  if (!res) return [];
  const maybe =
    res.cartItems ||
    res.data?.cartItems ||
    res.data?.Data?.cartItems ||
    res.data?.data?.cartItems ||
    res.Data?.cartItems ||
    res.data?.data ||
    res.cartItems;
  // if maybe is actually the cartItems array
  if (Array.isArray(maybe)) return maybe;

  // if res itself is array
  if (Array.isArray(res)) return res;

  // if res has Data which itself is cart object
  const alt =
    res.data?.data?.cartItems ||
    res.data?.Data?.cartItems ||
    res.Data?.cartItems ||
    res.cartItems;
  if (Array.isArray(alt)) return alt;

  return [];
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SetCart":
      return { ...state, cart: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchAndSetCart = async () => {
    try {
      const res = await getCartItems();
      const cartItems = reduceCartItemsFromResponse(res);
      dispatch({ type: "SetCart", payload: cartItems });
    } catch (err) {
      console.error("fetch cart failed:", err);
      dispatch({ type: "SetCart", payload: [] });
    }
  };

  useEffect(() => {
    fetchAndSetCart();
   
  }, []);

  
  const addItemToCart = async (productParam, quantity = 1) => {
    try {
      const productId =
        (productParam && (productParam.id || productParam.productId || productParam.ProductID)) ||
        productParam;
      await addToCart(productId, quantity);
      
      await fetchAndSetCart();
      return true;
    } catch (err) {
      console.error("Add item error:", err);
      throw err;
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await removeCartItems(cartItemId);
      await fetchAndSetCart();
      return true;
    } catch (err) {
      console.error("Remove item error:", err);
      throw err;
    }
  };

  const updateQuantity = async (cartItemId, change) => {
    try {
      
      await handleQuantityChange(cartItemId, change);
      await fetchAndSetCart();
      return true;
    } catch (err) {
      console.error("Update quantity error:", err);
      throw err;
    }
  };

  const clearCart = async () => {
  if (!state.cart || state.cart.length === 0) return true; 
  try {
    await clearCartItem();
    await fetchAndSetCart();
    return true;
  } catch (err) {
    console.error("Clear cart error:", err);
    throw err;
  }
};
  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        addItemToCart,
        removeItem,
        updateQuantity,
        clearCart,
        refreshCart: fetchAndSetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);


