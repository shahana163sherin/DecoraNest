import axios from "axios";

const API_URL = "http://localhost:5094/api/v1/users/Wishlist"; 

export const addToWish = async (productId) => {
  try {
    const res = await axios.post(`${API_URL}/Add`, { productId }, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return res.data.data; 
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};
export const getWishList = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  try {
    const res = await axios.get(`${API_URL}/AllWishlist`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      withCredentials: true,
    });
    return res.data.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Network error"
    );
  }
};

export const removeFromWish = async (wishlistId) => {
  if (!wishlistId) throw new Error("Wishlist ID is required");

  const token = localStorage.getItem("token"); 

  try {
    const res = await axios.delete(`${API_URL}/RemoveFromWish`, {
      params: { wishlistid: wishlistId },
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json"
      },
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw new Error(
      error.response?.data?.Message ||
      error.response?.data?.message ||
      "Network error"
    );
  }
};


export const toggleWish = async (productId) => {
  try {
    const res = await axios.post(`${API_URL}/toggle-wishlist`, { productId }, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return res.data.wishlist;
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    throw error;
  }
};
