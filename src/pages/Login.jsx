import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();
//     const result = await login(form.email, form.password);
//     console.log(result);
  
//     if (result?.success) {
//   alert("Welcome to DecoraNest");
//   navigate(result.role === "Admin" ? "/admin/dashboard" : "/");
// } else {
//   alert(result.error);
// }


//   };


const submit = async (e) => {
  e.preventDefault();

  const result = await login(form.email, form.password);
  console.log(result);

  if (result.success) {
    alert("Welcome to DecoraNest!");
    navigate(result.role === "Admin" ? "/admin/dashboard" : "/");
  } else {
    alert(result.error); 
  }
};


  return (
    
   <div
  className="relative min-h-screen flex items-center justify-center bg-cover bg-center "
  style={{ backgroundImage: `url('/assets/login.jpeg')` }} >
      

      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4 "
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">Login to<br/> <span className="text-2xl font-semibold text-center text-purple-800">DecoraNest</span></h2>

        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        
        <div>
          <label htmlFor="pwd" className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="pwd"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />

          
          <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
              className="accent-blue-600"
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>
        </div>

       
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>

        
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
