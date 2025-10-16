// import { createContext ,useContext,useEffect,useState} from "react";
// import axios from "axios";
// import { useNavigate } from "react-router";


// export const AuthContext = createContext();



// const AuthProvider = ({children}) => 
// {
    
//     const [user,setUser]=useState(null);
// const [loading,setLoading]=useState(true)
// const navigate=useNavigate();
  
//    useEffect(() => {
//   const storedUser = JSON.parse(localStorage.getItem("user"));
//   var token=localStorage.getItem("token");
//   var tokenExpiry=localStorage.getItem("tokenExpiry");
//   if (storedUser && token && tokenExpiry) {
//     const isExpired=new Date().getTime() > Number(tokenExpiry);
//     if(isExpired){
//       Logout();
//       return;
//     }
//     else{
//     setUser(storedUser);
//     }
    
//   } else {
//     setUser(null); 
//   }
//   setLoading(false);
// }, []);



//     //-----------------Login---------------------

// //    const Login = async (email, password) => {
// //   try {
// //     const BASE_URL = "http://localhost:3000/users";

    
// //     const res = await axios.get(BASE_URL, {
// //       params: {
// //         email,
// //         password,
// //       },
// //     });

// //     if (res.data.length === 0) {
// //       return { error: "Invalid Email or Password" };
// //     }

// //     const loggedInUser = res.data[0];

// //     if (loggedInUser.isBlock) {
// //       return { error: "User is Blocked" };
// //     }

  
// //     const freshUserRes = await axios.get(`${BASE_URL}/${loggedInUser.id}`);
// //     const freshUser = freshUserRes.data;

// //     localStorage.setItem("user", JSON.stringify(freshUser));
// //     setUser(freshUser);
    

// //     return { success: true,role:freshUser.role };
// //   } catch (error) {
// //     console.error("Login Error:", error);
// //     return { error: "Something went wrong. Please try again." };
// //   }
// // };
// //------------------------------------Login-----------------------------
// const Login = async(email,password)=>{
//   try{
//     const res=await axios.post("/Auth/Login",{email,password});
//     const data=res.data;
//     if(data.status !== "success"){
//       return {error:data.Message || "Invalid Credentials"};
//     }
//     const expiryTime = new Date().getTime() + 1000 * 60 * 60 * 24 * 7; // 7 days

//     localStorage.setItem("token",data.jwt_token);
//     localStorage.setItem("refreshToken",data.refresh_token);
//     localStorage.setItem("user",JSON.Stringify(data.user));
//     localStorage.setItem("tokenExpiry", expiryTime.toString());
//     setUser(data.user);
//     return {Success:true,role:data.user.role};
//   }
//   catch(error){
//     console.error("Login Error:",error);
//     return {error:"Something went wrong. Please try again."}
//   }
// }



//     //-----------------Logout---------------------

// // const Logout = async () => {
// //   try {
// //     if (user?.id && user?.role !== "admin") {
    
// //       await axios.patch(`http://localhost:3000/users/${user.id}`, {
// //         cart: [],
// //         wishlist: []
// //       });
// //     }

    
// //     localStorage.removeItem("user");
// //     localStorage.removeItem("cart");
// //     localStorage.removeItem("wishlist");

// //     setUser(null);

// //   } catch (error) {
// //     console.error("Logout failed:", error);
// //   }
// // };

// const Logout=async () =>{
//   try{
//     localStorage.removeItem("token");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("cart");
//     localStorage.removeItem("wishlist");
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/login", { replace: true });
//   }
//   catch(error){
//     console.error("Logout failed:",error);
    
//   }
// }


//     return (
// <>

// <AuthContext.Provider value={{user,setUser,loading,Login,Logout}}>
//     {children}
// </AuthContext.Provider>
// </>

//     );
// }
// export default AuthProvider
// export const useAuth =  () => useContext(AuthContext)





// import { createContext, useContext, useEffect, useState } from "react";
// import axiosInstance from "../api/axiosInstance";
// import { useNavigate } from "react-router";

//  const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   let refreshTimer = null;

//   useEffect(() => {
//     initAuth();
//     return () => clearTimeout(refreshTimer);
//   }, []);

//   const initAuth = () => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     const token = localStorage.getItem("token");
//     const tokenExpiry = localStorage.getItem("tokenExpiry");

//     if (storedUser && token && tokenExpiry) {
//       const isExpired = new Date().getTime() > Number(tokenExpiry);
//       if (isExpired) {
//         refreshToken();
//       } else {
//         setUser(storedUser);
//         startRefreshTimer(Number(tokenExpiry) - new Date().getTime());
//       }
//     } else {
//       setUser(null);
//     }
//     setLoading(false);
//   };

//   const startRefreshTimer = (delay) => {
//     clearTimeout(refreshTimer);
//     refreshTimer = setTimeout(refreshToken, delay - 60 * 1000);
//   };

//   const refreshToken = async () => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");
//       if (!refreshToken) throw new Error("No refresh token found");

//       const res = await axiosInstance.post("/Auth/refresh-token", { token: refreshToken });
//       const data = res.data;

//       if (data.status !== "success") throw new Error("Refresh token invalid");

//       const expiryTime = new Date().getTime() + 1000 * 60 * 60 * 24 * 7; // 7 days
//       localStorage.setItem("token", data.jwt_token);
//       localStorage.setItem("refreshToken", data.refresh_token || refreshToken);
//       localStorage.setItem("tokenExpiry", expiryTime.toString());

//       startRefreshTimer(expiryTime - new Date().getTime());
//     } catch (error) {
//       console.error("Token refresh failed:", error);
//       logout();
//     }
//   };


//   const register = async (UserName,Email,Password)=>{
//     try{
//       const res=await axiosInstance.post("/Auth/Register",{UserName,Email,Password,Role:"user"});
//       const data=res.data;
//       if(data.status !== "success"){
//         return {error:data.message || "Registration failed"};
//       }
//       return {success : true};
//     }
//     catch(error){

//              console.error("Registration failed:", error);
//               if (error.response?.data?.message) {
//       return { error: error.response.data.message }; 
//     }
//              return { error: "Something went wrong. Please try again." };
//     }
//   }

//   const login = async (email, password) => {
//     try {
//       const res = await axiosInstance.post("/Auth/Login", { email, password });
//       const data = res.data;

//       if (data.status !== "success") {
//         return { error: data.message || "Invalid credentials" };
//       }

//       const expiryTime = new Date().getTime() + 1000 * 60 * 60 * 24 * 7;
//       localStorage.setItem("token", data.jwt_token);
//       localStorage.setItem("refreshToken", data.refresh_token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       localStorage.setItem("tokenExpiry", expiryTime.toString()); 
//       localStorage.setItem("role",data.user.role);

//       setUser({ ...data.user, token: data.jwt_token });
//       startRefreshTimer(expiryTime - new Date().getTime());

//       return { success: true, role: data.user.role };
//     } catch (error) {
//       console.error("Login failed:", error);
//       return { error: "Something went wrong. Please try again." };
//     }
//   };

//   const logout = () => {
//     clearTimeout(refreshTimer);
//     localStorage.clear();
//     setUser(null);
//     navigate("/login", { replace: true });
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout,register,setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
// export default AuthContext;


import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  let refreshTimer = null;

  useEffect(() => {
    initAuth();
    return () => clearTimeout(refreshTimer);
  }, []);

  const initAuth = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      const tokenExpiry = localStorage.getItem("tokenExpiry");

      if (storedUser && token && tokenExpiry) {
        const isExpired = new Date().getTime() > Number(tokenExpiry);
        if (isExpired) {
          await refreshToken(); // try to refresh token if expired
        } else {
          setUser({ ...storedUser, token });
          startRefreshTimer(Number(tokenExpiry) - new Date().getTime());
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const startRefreshTimer = (delay) => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(refreshToken, delay - 60 * 1000); // refresh 1 min before expiry
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token found");

      const res = await axiosInstance.post("/Auth/refresh-token", { token: refreshToken });
      const data = res.data;

      if (data.status !== "success") throw new Error("Refresh token invalid");

      const expiryTime = new Date().getTime() + 1000 * 60 * 60 * 24 * 7; // 7 days
      localStorage.setItem("token", data.jwt_token);
      localStorage.setItem("refreshToken", data.refresh_token || refreshToken);
      localStorage.setItem("tokenExpiry", expiryTime.toString());

      // update user state with new token
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser({ ...storedUser, token: data.jwt_token });

      startRefreshTimer(expiryTime - new Date().getTime());
    } catch (error) {

      console.error("Token refresh failed:", error);
      logout();
    }
  };

  const register = async (UserName, Email, Password) => {
    try {
      const res = await axiosInstance.post("/Auth/Register", { UserName, Email, Password, Role: "User" });
      const data = res.data;
      if (data.status !== "success") {
        return { error: data.message || "Registration failed" };
      }
      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error);
      return { error: error.response?.data?.message || "Something went wrong. Please try again." };
    }
  };

  const login = async (email, password) => {
  try {
    const res = await axiosInstance.post("/Auth/Login", { email, password });
    const data = res.data;

    if (data.status === "error") {

      return { success: false, error: data.message || "Invalid credentials" };
    }

    const expiryTime = new Date().getTime() + 1000 * 60 * 60 * 24 * 7; 
    localStorage.setItem("token", data.jwt_token);
    localStorage.setItem("refreshToken", data.refresh_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("tokenExpiry", expiryTime.toString());
    localStorage.setItem("role", data.user.role);

    setUser({ ...data.user, token: data.jwt_token });
    startRefreshTimer(expiryTime - new Date().getTime());

    return { success: true, role: data.user.role };
  } catch (err) {
    console.error("Login failed:", err);
    const msg = err.response?.data?.message || "Something went wrong. Please try again.";
    return { success: false, error: msg };
  }
};


  const logout = () => {
    clearTimeout(refreshTimer);
    localStorage.clear();
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
