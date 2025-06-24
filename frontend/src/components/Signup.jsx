import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Heading,
  ScrollText,
  Wrench,
} from 'lucide-react';
import Header from './Header';
import toast from 'react-hot-toast';

export default function Signup() {
  const {signup , user} = useAuthStore();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: 'Electrical',
    roll: ''
  });

  const [role, setRole] = useState('Engineer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'confirmPassword') setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try{
      console.log(form.name, form.email, form.password, role.toLowerCase() , form.roll , form.specialization)
      await signup(form.name, form.email, form.password, role.toLowerCase() , form.roll , form.specialization);
      toast.success("Signup successful");
    }
    catch (error) {
      toast.error(error.response?.data?.message || "Error signing up");
      setError(error.response?.data?.message || "Error signing up");
      return;
    }
    

    
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
    <div className="flex flex-col justify-center items-center bg-white text-black px-4 py-10">
      <h2 className="text-5xl font-normal mb-1">Create Account</h2>
      <p className="text-gray-500 mb-6">Please fill in to create an account</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-sm shadow-md w-full max-w-md border border-gray-400"
      >
        {/* Role Selector */}
        <div className="flex gap-2 mb-6 justify-center">
          {['Engineer', 'Student'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-sm border ${
                role === r
                  ? 'bg-black text-white'
                  : 'bg-white text-black border-gray-400'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Full Name */}
        <div className="relative mb-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full pl-10 pr-4 py-2 rounded-sm bg-white border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
        </div>
        {role === 'Student' && ( 
          <div className="relative mb-4">
          <input
            type="text"
            name="roll"
            value={form.roll}
            onChange={handleChange}
            placeholder="Roll no."
            required
            className="w-full pl-10 pr-4 py-2 rounded-sm bg-white border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <ScrollText className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
        </div>
        )}
        {role === 'Engineer' && ( 
          <div className="relative mb-4 -mt-1">
            <div className='flex '>
            {/* <Wrench className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" /> */}
            <label className="block text-sm font-light text-blue-700 ml-1">Specialization</label>
            </div>
          <select
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Internet">Internet</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Other">Other</option>
                  </select>
          
        </div>
        )}
        {/* Email */}
        <div className="relative mb-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            className="w-full pl-10 pr-4 py-2 rounded-sm bg-white border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
        </div>

        {/* Password */}
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full pl-10 pr-10 py-2 rounded-sm bg-white border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-4">
          <input
            type={showConfirm ? 'text' : 'password'}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-type Password"
            required
            className="w-full pl-10 pr-10 py-2 rounded-sm bg-white border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-600 mb-3 text-center">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black text-white font-medium py-3.5 text-lg rounded-md hover:bg-gray-900 transition"
          onClick={handleSubmit}
        >
          Sign up
        </button>

        {/* Divider */}
        {/* <div className="flex items-center gap-2 my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="text-sm text-gray-500">Or continue with</span>
          <hr className="flex-grow border-gray-300" />
        </div> */}

        {/* Social Icons */}
        {/* <div className="flex justify-between gap-3">
          <button className="flex-1 border border-gray-300 hover:bg-gray-100 py-2 rounded-md">
            G
          </button>
          <button className="flex-1 border border-gray-300 hover:bg-gray-100 py-2 rounded-md">
            
          </button>
          <button className="flex-1 border border-gray-300 hover:bg-gray-100 py-2 rounded-md">
            ⊞
          </button>
        </div> */}

        {/* Bottom link */}
        <Link
        to="/login"
        
        >
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?
        </p>
        </Link>
      </form>
    </div>
    </div>
  );

}
