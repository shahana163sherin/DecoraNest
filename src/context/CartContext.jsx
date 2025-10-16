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
 
  if (!res) return [];
  const maybe =
    res.cartItems ||
    res.data?.cartItems ||
    res.data?.Data?.cartItems ||
    res.data?.data?.cartItems ||
    res.Data?.cartItems ||
    res.data?.data ||
    res.cartItems;
 
  if (Array.isArray(maybe)) return maybe;

  
  if (Array.isArray(res)) return res;

 
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


