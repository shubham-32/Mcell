import { Navigate, Route, Routes } from "react-router-dom";
import React from 'react';
import Login from "./components/login";
import Signup from "./components/Signup";
import User from "./components/User";
import Admin from "./components/Admin";
import Engineer from "./components/Engineer";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import LandingPage from "./components/LandingPage";
import { Toaster } from "react-hot-toast";
import SubmitComplain from "./components/submitComplain";
function App() {

	const { isCheckingAuth, checkAuth , user , isAuthenticated } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) {
    return <div className="loading-screen bg-gray-100 ">
      <div className="absolute left-1/2 top-1/2 ">
      <img src="logo.png" alt="" className="h-16 w-16 animate-spin"/>
      </div>
      
    </div>;
  }

  return (
	<>
	

    <Routes>
	
	  <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
	  <Route path="/adminDashboard" element={<Admin />} />
    <Route path="/submit" element={<SubmitComplain />} />
      {/* <Route
        path="/adminDashboard"
        element={
          isAuthenticated && user?.role === "admin"
            ? <Admin />
            : <Navigate to="/login" replace />
        }
      /> */}

      <Route
        path="/engineerDashboard"
        element={
          isAuthenticated && user?.role === "engineer"
            ? <Engineer />
            : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/studentDashboard"
        element={
          isAuthenticated && user?.role === "student"
            ? <User />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
	</>
  );
}

export default App;
	