import React, { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Header from './Header';
import toast from 'react-hot-toast';
const Login = () => {
  const [role, setRole] = useState('Student');
  const navigate = useNavigate();
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const {login , user , isAuthenticated} = useAuthStore();
  useEffect (() => {
    if(user) console.log("user role :" , user.role)
    console.log("state : ",isAuthenticated)

  } ,[user , isAuthenticated] )
  const handleLogin = async () => {
    try {
      await login(email , password , role.toLowerCase());
      toast.success("Login successful");
    }
    catch(error) {
      toast.error(error.response?.data?.message || "Error logging in");
      console.log(error);
    }

  }
  return (
    <div className="bg-white min-h-screen" >
    <Header />
    <div className="flex flex-col items-center justify-center  bg-white text-black px-4 py-10">
      
      {/* Heading */}
      <h1 className="text-5xl font-normal">Welcome back</h1>
      <p className="text-base text-gray-600 mt-2 mb-8">Please sign in to your account</p>

      {/* Card */}
      <div className="w-full max-w-md space-y-6 border border-gray-400 shadow-md rounded-sm p-8 bg-white">
        {/* Role Toggle */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {['Engineer', 'Admin', 'Student'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-5 py-2 rounded-sm text-base border transition ${
                role === r
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-gray-400'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-4 pr-12 py-3 rounded-sm bg-white text-black placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Mail className="absolute right-3 top-3.5 h-6 w-6 text-gray-500" />
          </div>

          {/* Password Input */}
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-4 pr-12 py-3 rounded-sm bg-white text-black placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-base"
          />
          <Lock className="absolute right-3 top-3.5 h-6 w-6 text-gray-500" />
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember" className="accent-black w-4 h-4" />
          <label htmlFor="remember" className="text-base text-gray-700">Remember me</label>
        </div>

        {/* Sign In */}
        <button className="w-full bg-black text-white hover:bg-gray-900 transition font-medium py-3 rounded-sm text-lg" onClick={handleLogin}>
          Log in
        </button>

        {/* OR Divider */}
        {/* <div className="flex items-center gap-2">
          <hr className="flex-grow border-gray-300" />
          <span className="text-sm text-gray-500">Or continue with</span>
          <hr className="flex-grow border-gray-300" />
        </div> */}

        {/* Social Buttons */}
        {/* <div className="flex justify-between gap-4">
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 transition py-3 rounded-sm flex items-center justify-center text-black border border-gray-300">
            <img src="/google.png" alt="" className='h-4 w-4' />
          </button>
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 transition py-3 rounded-sm flex items-center justify-center text-black border border-gray-300">
            <img src="/apple.png" alt=""  className='h-5 w-5'  />
          </button>
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 transition py-3 rounded-sm flex items-center justify-center text-black border border-gray-300">
            <img src="/microsoft.png" alt=""  className='h-4 w-4'  />
          </button>
        </div> */}

        {/* Bottom Link */}
        <Link
        to="/signup"
        >
        <p className="text-sm text-gray-600 text-center mt-4">
          Don’t have an account?
        </p>
        </Link>
      </div>
    </div>
    </div>
  );
};

export default Login;
