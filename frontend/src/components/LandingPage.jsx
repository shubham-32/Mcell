import React from "react";
import { ArrowRight, User, PenTool, Crown, Clock, BarChart3, CheckCircle } from 'lucide-react';
import { Link } from "react-router-dom";
import Login from "./login";
import Signup from "./Signup";
import Header from "./Header";
import { useAuthStore } from "../store/useAuthStore";
const LandingPage = () => {
    const { user, isAuthenticated } = useAuthStore();
    return (
        <div className="min-h-screen bg-white">
            <Header />
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16 py-16 bg-gray-50">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif leading-tight">
                IIIT-A<br />
                Maintenance Cell<br />
                Management System
              </h1>
              <p className="mt-6 text-lg font-light text-gray-600">
                Efficient campus maintenance system for IIITA community. Simplifying 
                issue reporting and resolution through digital transformation.
              </p>
              
                {!isAuthenticated ? (
                    <Link
                    to="/signup"
                  >
                    <button className="mt-8 flex items-center gap-2 bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors">
                    Get Started <ArrowRight size={16} />
                  </button>
                  </Link>
                  ) : (
                    <Link
                    to={`/${user.role}Dashboard`}
                  >
                    <button className="mt-8 flex items-center gap-2 bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors">
                    Dashboard <ArrowRight size={16} />
                  </button>
                  </Link>
                )
                }
              
            </div>
            <div className="lg:w-1/2">
              <div className="bg-white p-2 rounded-lg shadow-lg">
                <img 
                  src="/admin.jpeg" 
                  alt="Dashboard preview" 
                  className="rounded w-full" 
                />
              </div>
            </div>
          </div>
    
          {/* How It Works Section */}
          <div className="py-16 px-6 lg:px-16">
            <h2 className="text-3xl font-bold font-serif text-center text-gray-900">How It Works ? </h2>
    
    
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
              <div className="p-6 bg-white rounded-lg border border-gray-300 flex flex-col items-center text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <User size={24} className="text-gray-800" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Students</h3>
                <p className="text-gray-600">
                  Register complaints easily with your roll number and room details. Track status in real-time.
                </p>
              </div>
    
              <div className="p-6 bg-white rounded-lg border border-gray-300 flex flex-col items-center text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <img src="tool.png" alt="" className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Engineers</h3>
                <p className="text-gray-600">
                  Access assigned tasks, update work status, and manage maintenance schedules efficiently.
                </p>
              </div>
    
              <div className="p-6 bg-white rounded-lg border border-gray-300 flex flex-col items-center text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Crown size={24} className="text-gray-800" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Administrators</h3>
                <p className="text-gray-600">
                  Oversee all maintenance requests, assign engineers, and monitor system performance.
                </p>
              </div>
            </div>
          </div>
    
          {/* Features Section */}
          <div className="py-16 px-6 lg:px-16 bg-gray-50">
            <div className="flex items-center  gap-3">
            <img src="features.png" alt="" className="h-8 w-8"/>
            <div className="text-3xl font-bold font-serif text-gray-900">System Features</div>
            
            </div>
            
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 mb-10 lg:mb-0">
                <div className="mb-8">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Easy Complaint Registration</h3>
                      <p className="text-gray-600">Simple and intuitive interface for students to submit maintenance requests</p>
                    </div>
                  </div>
                </div>
    
                <div className="mb-8">
                  <div className="flex items-start gap-4">
                    <Clock className="text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
                      <p className="text-gray-600">Track the status of your maintenance requests in real-time</p>
                    </div>
                  </div>
                </div>
    
                <div className="mb-8">
                  <div className="flex items-start gap-4">
                    <BarChart3 className="text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                      <p className="text-gray-600">Comprehensive reporting and analytics for administrators</p>
                    </div>
                  </div>
                </div>
              </div>
    
              <div className="lg:w-1/2">
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <img 
                    src="/user.jpeg" 
                    alt="Analytics dashboard" 
                    className="rounded w-full"
                  />
                </div>
              </div>
            </div>
          </div>
    
         
    
          {/* Footer */}
          <footer className="py-8 bg-gray-900 text-gray-400 text-center">
            <p>&copy; 2025 Maintenance Management System.</p>
          </footer>
        </div>
      );
    }

export default LandingPage;