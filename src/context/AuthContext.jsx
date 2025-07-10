import { createContext ,useContext,useEffect,useState} from "react";
import axios from "axios";

export const AuthContext = createContext();



const AuthProvider = ({children}) => 
{
    
    const [user,setUser]=useState(null);
const [loading,setLoading]=useState(true)
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

    const Login = async (email,password) =>{
        try{ 
            const BASE_URL = "http://localhost:3000/users";

        const res=await axios.get(BASE_URL,{
            params:{
                email,password
            }
        })
        console.log(res.data)
        if (res.data.length === 0){
            return {error:"Invalid Email or Password"}
        }
        const loggedInUser = res.data[0]
        if (loggedInUser.isBlock){
            return {error:"User is Blocked"};
        }
        localStorage.setItem("user",JSON.stringify(loggedInUser))
        setUser(loggedInUser)
        return{success:true}
    }  
   catch (error) {
  console.error("Error Occured", error);
  return { error: "Something went wrong. Please try again." };
}


       
}

//---------------logout----------------

const Logout = () => {

    localStorage.removeItem("user");
    setUser(null)
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