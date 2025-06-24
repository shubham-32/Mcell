import { create } from "zustand";
import React from "react";
import toast from "react-hot-toast";

import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,
    
    signup: async (name, email, password, role , roll , specialization) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, { name, email, password, role , roll , specialization});
            
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
            if (role === 'admin') {
                window.location.href = '/adminDashboard';  // Alternative approach
              } else if (role === 'engineer') {
                window.location.href = '/engineerDashboard';
              } else {
                window.location.href = '/studentDashboard';
              }

        } catch (error) {
            toast.error(error.response.data.message || "Error signing up");
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
            throw error;
        }
    },

    login: async (email, password, role) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/login`, { email, password, role });
          toast.success("login successful");
          console.log("Full response:", response);
          console.log("Response data:", response.data);
          
          set({
            isAuthenticated: true,
            user: response.data.user,
            error: null,
            isLoading: false,
          });

          if (role === 'admin') {
            window.location.href = '/adminDashboard';  // Alternative approach
          } else if (role === 'engineer') {
            window.location.href = '/engineerDashboard';
          } else {
            window.location.href = '/studentDashboard';
          }
        } catch (error) {
        toast.error(error.response?.data?.message || "Error logging in");
          console.error("Login error:", error);
          set({
            error: error.response?.data?.message || "Error logging in",
            isLoading: false
          });
          throw error;
        }
      },
	

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            set({ user: null, isAuthenticated: false, error: null, isLoading: false });
            window.location.href = '/login';  // Redirect to login page
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },


    // In your checkAuth function in useAuthStore
checkAuth: async () => {
    console.log("Starting auth check...");
    set({ isCheckingAuth: true, error: null });
    try {
        console.log("Making request to:", `${API_URL}/check-auth`);
        const response = await axios.get(`${API_URL}/check-auth`);
        console.log("Full response:", response);
        
        if (response.data.success && response.data.user) {
            console.log("User data found, updating state:", response.data.user);
            set({ 
                user: response.data.user, 
                isAuthenticated: true, 
                isCheckingAuth: false 
            });
        } else {
            console.log("No user data in response:", response.data);
            set({ 
                user: null, 
                isAuthenticated: false, 
                isCheckingAuth: false 
            });
        }
    } catch (error) {
        console.error("Auth check error:", error);
        set({ 
            user: null, 
            error: null, 
            isCheckingAuth: false, 
            isAuthenticated: false 
        });
    }
},

submitComplaint: async (formData) => {
  set({ isLoading: true });
  try {
    const response = await axios.post(`${API_URL}/submit`, formData);
    toast.success("Complaint submitted");
    window.location.reload();
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Error submitting complaint");
    throw error;
  } finally {
    set({ isLoading: false });
  }
},

getStudentComplaints: async () => {
  try {
    const response = await axios.get(`${API_URL}/student/all`);
    return response.data.complaints;
  } catch (error) {
    toast.error("Failed to fetch your complaints");
    return [];
  }
},
getAllComplaintsForAdmin: async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/complaints`);
    return response.data.complaints;
  } catch (error) {
    toast.error("Failed to fetch complaints");
    return [];
  }
},
getAllEngineersForAdmin: async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/engineers`);
    return response.data.engineers;
  } catch (error) {
    toast.error("Failed to fetch complaints");
    return [];
  }
},

getAllTasksForAdmin: async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/tasks`);
      return response.data.tasks;
    }
    catch(error) {
      console.log("error fetching all tasks for admin :" , error);
      return [];
    }
}, 

assignEngineerToComplaint: async (assignmentData) => {
  console.log(assignmentData)
  try {

    const response = await axios.post(`${API_URL}/admin/assign`, assignmentData);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to assign engineer');
    }
  } catch (error) {
    console.error('Error assigning engineer:', error);
    throw error;
  }
},
getEngineerTasks: async () => {
  try {
    const response = await axios.get(`${API_URL}/engineer/tasks`);
    
    if (response.data.success) {
      return response.data.tasks;
    } else {
      throw new Error(response.data.message || 'Failed to fetch tasks');
    }
  } catch (error) {
    console.error('Error fetching engineer tasks:', error);
    throw error;
  }
},
getEngineerCompletedTasks: async () => {
  try {
    const response = await axios.get(`${API_URL}/engineer/completedTasks`);
    if (response.data.success) {
      return response.data.completedTasks;
    } else {
      throw new Error(response.data.message || 'Failed to fetch tasks');
    }
  } catch (error) {
    console.error('Error fetching engineer tasks:', error);
    throw error;
  }
},
updateTaskStatus: async (taskId, statusData) => {
  try {
    const response = await axios.put(`${API_URL}/engineer/update/${taskId}`, statusData);
    window.location.reload();
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to update task status');
    }
    
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
},

toggleResubmit: async  (complaintId) => {
  console.log("atAuthstore :" , complaintId)
  try {
    const response = await axios.post(`${API_URL}/complaint/toggle`, { complaintId: complaintId })
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to update task status');
    }
    
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
}
  
// /engineer/completedTasks
}));



