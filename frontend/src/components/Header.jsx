import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // your logout function
    toast.success("Logout successful");
    navigate('/login');
  };

  return (
    <header className="py-4 px-6 lg:px-16 bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-10 w-10 mr-3" />
            <span className="text-xl font-bold text-gray-900">M-Cell</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="/" className="text-gray-700 hover:text-black">Home</a>
          <a href="/" className="text-gray-700 hover:text-black">Features</a>
          <a href="/" className="text-gray-700 hover:text-black">How It Works</a>
          <a href="/" className="text-gray-700 hover:text-black">Contact</a>
        </nav>

        {/* Auth Section - Desktop */}
        {!isAuthenticated ? (
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <button className="px-5 py-2 text-gray-900 hover:text-black border border-gray-300 rounded-md hover:border-gray-400 transition-colors">
                Log In
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                Sign Up
              </button>
            </Link>
          </div>
        ) : (
          <div className="relative hidden md:flex items-center space-x-4">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4.5 p-2.5 bg-blue-100  text-blue-900 hover:text-black border-2 border-blue-500 rounded-full hover:border-2 hover:border-blue-700 transition-colors focus:outline-none duration-300"
            >
              {user.name[0].toUpperCase()}

            </button>
            <div
            className='bg-green-100 border font-normal border-green-600 text-green-600  py-1 px-3 text-sm rounded-full'
            >
              
              
                <div className='flex items-center gap-1'>
                <div className='h-2 w-2 bg-green-600 rounded-full'>

</div>
                logged in as <span className='font-semibold'>{user.role}</span>
                
                </div>
               

            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-14 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 ease-in-out">
                <Link
                  to={`/${user.role}Dashboard`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 py-4 border-t border-gray-100">
          <nav className="flex flex-col space-y-4">
            <a href="#" className="text-gray-700 hover:text-black">Home</a>
            <a href="#features" className="text-gray-700 hover:text-black">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-black">How It Works</a>
            <a href="#contact" className="text-gray-700 hover:text-black">Contact</a>
          </nav>
          <div className="flex flex-col space-y-3 mt-6">
            <Link to="/login">
              <button className="px-5 py-2 text-gray-900 border border-gray-300 rounded-md hover:border-gray-400 transition-colors">
                Log In
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
