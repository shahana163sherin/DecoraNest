import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const {register,login}=useAuth();

    const [user,setUser]=useState({
        UserName:"",
        Email:"",
        Password:"",
        confirm_password:""
    })
    
  const navigate=useNavigate();
  const [showPassword,setShowPassword]= useState(false)
  const [showConfirmPassword,setShowConfirmPassword]= useState(false)
  const [loading, setLoading] = useState(false);
  



const submit = async (e) =>{
     e.preventDefault(); 
     setLoading(true);

     
     const number=/\d/.test(user.Password)
    const symbol = /[!./,?"@#$%^&*:;'|<>{}()`~]/.test(user.Password)
    
    if(user.Password.length < 8 || !number || !symbol){
        alert("Password must contain 8 characters and include atleast one number and one symbol")
        return ;
    }

    if (user.Password !== user.confirm_password){
        alert("Password must be match")
        return;
    }
   
    const validateEmail = (email) => {
        return  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    if (!validateEmail(user.Email)){
        alert("Enter valid Email")
        return;
    }
   
  
    const res = await register(user.UserName, user.Email, user.Password);

  if (!res?.error) {
    const loginRes = await login(user.Email, user.Password);

    if (loginRes?.success) {
      navigate(loginRes.role === "Admin" ? "/admin/dashboard" : "/");
    } else {
      alert(loginRes?.error || "Login after registration failed");
    }
  } else {
    alert(res.error);
  }

  setLoading(false);

}



    return(
  <div
  className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
  style={{ backgroundImage: `url('/assets/login.jpeg')` }}
>
  <form
    onSubmit={submit}
    className="w-full max-w-md backdrop-blur-md p-8 rounded-2xl shadow-lg border border-purple-100 space-y-6"
  >
    <h2 className="text-3xl font-bold text-center text-purple-700">Sign Up</h2>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
      <input
        type="text"
        placeholder="Enter your name"
        value={user.UserName}
        required
        onChange={(e) => setUser({ ...user, UserName: e.target.value })}
        className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:outline-none"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input
        type="email"
        placeholder="Enter your email"
        value={user.Email}
        required
        onChange={(e) => setUser({ ...user, Email: e.target.value })}
        className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:outline-none"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={user.Password}
        required
        onChange={(e) => setUser({ ...user, Password: e.target.value })}
        className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:outline-none"
      />
      <div className="mt-1 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
          className="mr-1"
        />
        Show Password
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
      <input
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirm Password"
        value={user.confirm_password}
        required
        onChange={(e) => setUser({ ...user, confirm_password: e.target.value })}
        className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:outline-none"
      />
      <div className="mt-1 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={showConfirmPassword}
          onChange={() => setShowConfirmPassword(!showConfirmPassword)}
          className="mr-1"
        />
        Show Confirm Password
      </div>
    </div>

    <button
  type="submit"
  disabled={loading}
  className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition shadow disabled:opacity-50"
>
  {loading ? "Registering..." : "Sign Up"}
</button>
  </form>
</div>

    );
}
export default Register