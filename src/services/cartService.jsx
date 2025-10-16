
import axiosInstance from "../api/axiosInstance";

const API_URL = "/users/Cart"; // base URL with version is already handled in axiosInstance

// Add product to cart
export const addToCart = async (productId, quantity = 1) => {
  try {
    const res = await axiosInstance.post(`${API_URL}/add`, {
      ProductID: productId,
      Quantity: quantity,
    });
    return res.data;
  } catch (error) {
    console.error("Add to cart error:", error);
    throw new Error(error.response?.data?.message || error.message || "Network error");
  }
};

// Get all cart items
export const getCartItems = async () => {
  try {
    const res = await axiosInstance.get(`${API_URL}/Items`);
    return res.data;
  } catch (error) {
    console.error("Fetch cart error:", error);
    throw new Error(error.response?.data?.message || error.message || "Network error");
  }
};

// Remove single item from cart
export const removeCartItems = async (cartItemId) => {
  try {
    const res = await axiosInstance.delete(`${API_URL}/RemoveItem/${cartItemId}`);
    return res.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw new Error(error.response?.data?.message || error.message || "Network error");
  }
};

// Clear entire cart
export const clearCartItem = async () => {
  try {
    const cartToken = localStorage.getItem("token");
    console.log("Clearing cart with token:", cartToken);

    // Optional: get cart length from backend before deleting
    const resCart = await axiosInstance.get(`${API_URL}/Items`);
    const cartItems = resCart.data?.data?.cartItems || [];
    if (cartItems.length === 0) {
      console.log("Cart already empty, skipping clearCart API call");
      return { success: true };
    }

   
    const res = await axiosInstance.delete(`${API_URL}/ClearCart`);
    return res.data;
  } catch (error) {
    console.error("Error clearing cart:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || "Failed to clear cart");
  }
};

// Update quantity of a cart item
export const handleQuantityChange = async (cartItemId, change) => {
  try {
    const res = await axiosInstance.patch(
      `${API_URL}/update-quantity/${cartItemId}?change=${change}`
    );
    return res.data;
  } catch (error) {
    console.error("Error updating quantity:", error);
    throw new Error(error.response?.data?.message || error.message || "Network error");
  }
};

