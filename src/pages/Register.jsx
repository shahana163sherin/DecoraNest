import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const [user,setUser]=useState({
        name:"",
        email:"",
        password:"",
        confirm_password:""
    })
    
  const navigate=useNavigate();
  const [showPassword,setShowPassword]= useState(false)
  const [showConfirmPassword,setShowConfirmPassword]= useState(false)



const submit = async (e) =>{
     e.preventDefault();
       const res=await axios.get ("http://localhost:3000/users",{
            params:{email:user.email}
        });
        if(res.data.length > 0){
             alert ("Email already exists")
             return;
        }    
    

   
    const number=/\d/.test(user.password)
    const symbol = /[!./,?"@#$%^&*:;'|<>{}()`~]/.test(user.password)
    
    if(user.password.length < 8 || !number || !symbol){
        alert("Password must contain 8 characters and include atleast one number and one symbol")
        return ;
    }

    if (user.password !== user.confirm_password){
        alert("Password must be match")
        return;
    }
   
    const validateEmail = (email) => {
        return  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    if (!validateEmail(user.email)){
        alert("Enter valid Email")
        return;
    }
   
     await axios.post("http://localhost:3000/users",{
            
                name:user.name,
                email:user.email,
                password:user.password,
                role:"user",
                isBlock:false,
                cart:[],
                wishlist:[],
                orders:[],
                createdAt: new Date().toISOString()

            
        })

    
   alert("Registered successfully!");
 
     navigate("/login")



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
        value={user.name}
        required
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:outline-none"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input
        type="email"
        placeholder="Enter your email"
        value={user.email}
        required
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        className="w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:outline-none"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={user.password}
        required
        onChange={(e) => setUser({ ...user, password: e.target.value })}
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
      className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition shadow"
    >
      Sign Up
    </button>
  </form>
</div>

    );
}
export default Register