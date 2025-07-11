import { createContext ,useContext,useEffect,useState} from "react";
import axios from "axios";
// import { useCart } from "./CartContext";
// import { useWishList } from "./WishlistContext";
// import { useCart } from "./CartContext";

export const AuthContext = createContext();



const AuthProvider = ({children}) => 
{
    
    const [user,setUser]=useState(null);
const [loading,setLoading]=useState(true)
  // const {dispatch:cartDispatch}=useCart();
  // const {dispatch:wishDispatch}=useWishList();
   useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser && storedUser.id) {
    setUser(storedUser);
  } else {
    setUser(null); // ensures consistency
  }
  setLoading(false);
}, []);



    //-----------------Login---------------------

   const Login = async (email, password) => {
  try {
    const BASE_URL = "http://localhost:3000/users";

    // First: validate user with email & password
    const res = await axios.get(BASE_URL, {
      params: {
        email,
        password,
      },
    });

    if (res.data.length === 0) {
      return { error: "Invalid Email or Password" };
    }

    const loggedInUser = res.data[0];

    if (loggedInUser.isBlock) {
      return { error: "User is Blocked" };
    }

  
    const freshUserRes = await axios.get(`${BASE_URL}/${loggedInUser.id}`);
    const freshUser = freshUserRes.data;

    localStorage.setItem("user", JSON.stringify(freshUser));
    setUser(freshUser);

    return { success: true };
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Something went wrong. Please try again." };
  }
};


//---------------logout----------------

const Logout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
   
    setUser(null);



}


    return (
<>

<AuthContext.Provider value={{user,setUser,loading,Login,Logout}}>
    {children}
</AuthContext.Provider>
</>

    );
}
export default AuthProvider
export const useAuth =  () => useContext(AuthContext)