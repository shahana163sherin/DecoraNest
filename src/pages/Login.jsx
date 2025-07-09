// import { useState } from "react"
// import { useAuth } from "../context/AuthContext"

// const Login = () => {
//     const {Login}=useAuth();

// const [form,setForm]=useState({
//     email:"",
//     password:""
// }
// )

// const submit = async (e) => {

//     e.preventDefault();
//     const result=await Login(form.email,form.password);
//    if (result?.error) {
//     alert(result.error); // Show error message
//   } else {
//     alert("Login successful!");
// }
// }

// return (

//     <form onSubmit={submit}>
//         <label htmlFor="email">Email</label>

//     <input type="email"
//      id="email" 
//      placeholder="Enter your Email:"
//       required
//       value={form.email}
//        onChange={((e)=>setForm({...form,email:e.target.value}))}/>
//        <br/>

//        <label htmlFor="pwd">Password</label>

//     <input type="password"
//      id="pwd"
//       placeholder="Password:"
//        required
//        value={form.password}
//        onChange={(e)=>setForm({...form,password:e.target.value})}/>

//     <br/>

//     <button type="submit">Login</button>

//     </form>
// );

// }
// export default Login



import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const { Login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const result = await Login(form.email, form.password);
    if (result?.error) {
      alert(result.error);
    } else {
      alert("Login successful!");
    }
  };

  return (
    
   <div
  className="relative min-h-screen flex items-center justify-center bg-cover bg-center "
  style={{ backgroundImage: `url('/assets/login.jpeg')` }} // ✅ Put image in public/assets
>
        {/* <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div> */}

      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4 ml-90"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">Login to<br/> <span className="text-2xl font-semibold text-center text-purple-800">DecoraNest</span></h2>

        {/* Email */}
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

        {/* Password */}
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

          {/* Show Password Toggle */}
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>

        {/* Link to Register */}
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
