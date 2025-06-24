import React from 'react';
import { useState, useEffect } from 'react';
import { Bell, MessageSquare, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Legend  } from 'recharts';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-hot-toast'; // Make sure to install react-hot-toast if not already
import FilterDropdown from './FilterDropdown';
// New Assignment Modal Component
const AssignmentModal = ({ isOpen, onClose, complaint, engineers, onAssign }) => {
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [deadline, setDeadline] = useState('');
  
  if (!isOpen) return null;
  
  const handleAssign = () => {
    if (!selectedEngineer) {
      toast.error("Please select an engineer");
      return;
    }
    
    if (!deadline) {
      toast.error("Please set a deadline");
      return;
    }
    
    onAssign({
      complaintId: complaint.complaint_id,
      engineerId: selectedEngineer.engineer_id,
      deadline
    });
    
    onClose();
  };
  
  // Calculate minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center z-50">
      <div className="bg-white w-full h-full overflow-auto">
        {/* Header */}
        <div className="bg-gray-50 text-black p-5 border-b border-blue-200 flex justify-between items-center shadow-md">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-full shadow-md mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-light text-black">Assign Engineer to Complaint</h2>
          </div>
          <button onClick={onClose} className="text-black hover:bg-gray-200 p-2 rounded-full transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-gray-50 min-h-screen">
          {/* Complaint Details */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gray-900 px-6 py-4">
              <h3 className="font-light text-xl text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                Complaint Details
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 bg-purple-50 p-4 rounded-lg">
                  <span className="text-purple-800 font-semibold text-sm uppercase tracking-wider">Complainee</span>
                  <p className="text-gray-700 font-medium mt-1">{complaint?.email}</p>
                </div>
                
                <div className="col-span-2 bg-blue-50 p-4 rounded-lg">
                  <span className="text-blue-800 font-semibold text-sm uppercase tracking-wider">Subject</span>
                  <p className="text-gray-700 font-medium mt-1">{complaint?.subject}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <span className="text-green-800 font-semibold text-sm uppercase tracking-wider">Hostel</span>
                  <p className="text-gray-700 font-medium mt-1">{complaint?.hostel_no}</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <span className="text-gray-800 font-semibold text-sm uppercase tracking-wider">Priority</span>
                  <p className={`font-medium mt-1 ${
                    complaint?.priority === 'High' ? 'text-red-600' : 
                    complaint?.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>{complaint?.priority}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <span className="text-gray-700 font-semibold block mb-2">Description:</span>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{complaint?.description}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Engineer Selection */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
              <h3 className="font-light text-xl text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                Select Engineer & Deadline
              </h3>
            </div>
            
            <div className="p-6">
              <div className="mb-6 bg-teal-50 p-4 rounded-lg">
                <label className="block text-teal-800 font-semibold text-sm uppercase tracking-wider mb-2">Set Deadline:</label>
                <div className="flex items-center">
                  <Calendar size={18} className="text-teal-600 mr-2" />
                  <input 
                    type="date"
                    min={minDate}
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="border border-teal-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-gray-800 font-semibold mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-teal-600">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Available Engineers:
                </h4>
                
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {engineers
                    .filter(eng => eng.status === 'Available')
                    .map(engineer => (
                      <div 
                        key={engineer.engineer_id}
                        className={`p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer ${
                          selectedEngineer?.engineer_id === engineer.engineer_id 
                            ? 'border-teal-500 bg-teal-50 shadow-md' 
                            : 'border-gray-200 hover:border-teal-300'
                        }`}
                        onClick={() => setSelectedEngineer(engineer)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-12 h-12 rounded-full mr-4 flex items-center justify-center bg-gradient-to-br ${
                              selectedEngineer?.engineer_id === engineer.engineer_id
                                ? 'from-green-400 to-green-400'
                                : 'from-gray-100 to-gray-100'
                            }`}>
                              <img 
                                src="/1.png"
                                alt={engineer.name}
                                className="w-10 h-10 rounded-full"
                              />
                            </div>
                            <div>
                              <h5 className="font-medium text-lg">{engineer.name}</h5>
                              <div className="flex items-center mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600 mr-1">
                                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                                <p className="text-gray-600">{engineer.specialization}</p>
                              </div>
                            </div>
                          </div>
                          
                          {selectedEngineer?.engineer_id === engineer.engineer_id && (
                            <div className="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                
                {engineers.filter(eng => eng.status === 'Available').length === 0 && (
                  <div className="text-center p-12 border border-dashed border-gray-300 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p className="text-gray-500 font-medium">No available engineers at the moment</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-white p-6 border-t border-gray-200 flex justify-end sticky bottom-0 shadow-inner">
          <button 
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium mr-4 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleAssign}
            className={`px-6 py-3 rounded-lg  font-medium flex items-center ${
              !selectedEngineer || !deadline 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white duration-300 '
            }`}
            disabled={!selectedEngineer || !deadline}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Assign Engineer
          </button>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const { getAllComplaintsForAdmin, getAllEngineersForAdmin, assignEngineerToComplaint ,getAllTasksForAdmin } = useAuthStore();
  const [co, setCo] = useState([]);
  const [en, setEn] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selection , setSelection] = useState('')
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedEngineer , setSelectedEngineer] = useState(null);
  const [showEngineerModal , setShowEngineerModal] = useState(null);
  const [filters, setFilters] = useState({
    priority: null,
    status: null,
    subject: null
  });

  useEffect(()=> {
    const getAllTasks = async () => {
      try {
        const allco = await getAllTasksForAdmin();
        console.log("all co : ", allco);
        setTasks(allco);
      }
      catch(err) {
        console.log(err);
      }
    }
    getAllTasks();
  } ,[])

  const handleEngineerClick = (engineer) => {
    setSelectedEngineer(engineer);
    setShowEngineerModal(true);
  }

  
  // Updated filtering logic to support arrays of filter values
  const filteredComplaints = co.filter(complaint => {
    // If no filters are applied, show all complaints
    if (!filters.priority && !filters.status && !filters.subject) {
      return true;
    }

    // Apply status filter (now supporting multiple selections)
    if (filters.status && filters.status.length > 0 && !filters.status.includes(complaint.status)) {
      return false;
    }

    // Apply priority filter (now supporting multiple selections)
    if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(complaint.priority)) {
      return false;
    }

    // Apply specialization filter (now supporting multiple selections)
    if (filters.subject && filters.subject.length > 0 && !filters.subject.includes(complaint.subject)) {
      return false;
    }

    return true;
  });
  useEffect(() => {
    const getComplaints = async () => {
      try {
        const complaints = await getAllComplaintsForAdmin();
        console.log("complaints : ", complaints);
        setCo(complaints);
      } catch (error) {
        toast.error("Error fetching complaints: " + error.message);
      }
    };
    getComplaints();
  }, []);

  useEffect(() => {
    const getEngineers = async () => {
      try {
        const engineers = await getAllEngineersForAdmin();
        console.log("engineers : ", engineers);
        setEn(engineers);
      } catch (error) {
        toast.error("Error fetching engineers: " + error.message);
      }
    };
    getEngineers();
  }, []);
  
  const handleOpenAssignModal = (complaint) => {
    setSelectedComplaint(complaint);
    setIsAssignModalOpen(true);
  };
  
  const handleAssignEngineer = async (assignmentData) => {
    try {
      await assignEngineerToComplaint(assignmentData);
      window.location.reload();
      getAllTasks();
      getComplaints();
      // Update local state to reflect changes
      // 1. Update engineer status
      setEn(prev => prev.map(eng => 
        eng.engineer_id === assignmentData.engineerId 
          ? {...eng, status: 'Busy'} 
          : eng
      ));
      
      // 2. Remove complaint from unassigned list
      setCo(prev => prev.filter(c => c.complaint_id !== assignmentData.complaintId));
      
      toast.success("Engineer assigned successfully!");
    } catch (error) {
      toast.error("Failed to assign engineer: " + error.message);
    }
  };

  // Resolution rate data for line chart
  const resolutionData = (() => {
    const today = new Date();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const lastWeekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = daysOfWeek[date.getDay()];
      const assignedComplaints = co.filter(complaint => {
        const assignedDate = new Date(complaint.created_at);
        return (
          assignedDate.toDateString() === date.toDateString() 
        );
      }).length;

      lastWeekData.push({ day: dayName, rate: assignedComplaints });
    }

    return lastWeekData;
  })();
  
  // Problem types data for pie chart
  const problemTypesData = [
    { name: 'Furniture', value: co.filter(complaint => complaint.subject === "Furniture").length} ,
    { name: 'Internet', value: co.filter(complaint => complaint.subject === "Internet").length },
    { name: 'Plumbing', value: co.filter(complaint => complaint.subject === "Plumbing").length },
    { name: 'Electrical', value: co.filter(complaint => complaint.subject === "Electrical").length },
    { name: 'Other', value: co.filter(complaint => complaint.subject === "Other").length }
  ];
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };
  const [activeIndex, setActiveIndex] = useState(null);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  const getPriority = (status) => {
    const base = 'px-2 py-1 rounded-full text-xs -ml-1 font-semibold  ';
    switch (status) {
      case 'Low': return <span className={`${base} bg-green-100 text-green-600`}>{status} priority</span>;
      case 'Medium': return <span className={`${base} bg-yellow-100 text-yellow-600`}>{status} priority</span>;
      case 'High': return <span className={`${base} bg-red-100 text-red-600`}>{status} priority</span>;
      default: return <span className={base}>{status}</span>;
    }
  };
  
  // Colors for pie chart
  const COLORS = ['#4361ee', '#4cc9f0', '#f8961e', '#ef476f', '#6d6875'];
    
  const getStatusBadge = (status) => {
    if (status === 'Available') {
      return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Available</span>;
    } else if (status === 'Busy') {
      return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Busy</span>;
    } else {
      return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{status}</span>;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <div className="flex items-center">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="h-10 w-10 mr-3"
                />
                <span className="text-xl font-bold text-gray-900">M-Cell</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-semibold">Administrator</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Ticket Stats */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className="bg-gray-100 rounded p-3 mr-4">
              <MessageSquare size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Complaints</p>
              <p className="text-2xl font-bold">{co.length}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className="bg-green-100 rounded p-3 mr-4">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Resolved</p>
              <p className="text-2xl font-bold">{co.filter((complaint) => complaint.status === "Resolved").length}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className="bg-yellow-100 rounded p-3 mr-4">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Unassigned</p>
              <p className="text-2xl font-bold">{co.filter(complaint => complaint.status === "Submitted").length}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className="bg-red-100 rounded p-3 mr-4">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Critical</p>
              <p className="text-2xl font-bold">{co.filter(complaint => (complaint.status === "Submitted" &&  complaint.priority === "High")).length}</p>
            </div>
          </div>
        </div>
        
        {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Resolution Rate Chart */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Complaints Assign Rate</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={resolutionData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 25]} ticks={[0, 5, 10, 15, 20, 25]} />
              <Tooltip 
                formatter={(value) => [`${value} complaints`, "Assigned Complaints"]}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#4361ee"
                strokeWidth={2}
                dot={{ r: 4, fill: "#4361ee", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Problem Types Chart */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-4">Complaint Types</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={problemTypesData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              label={renderCustomizedLabel}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {problemTypesData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                />
              ))}
            </Pie>
            <Legend layout="vertical" verticalAlign="middle" align="right" />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
        </div>
        
       { /* Bottom Row */}
       <div className="grid grid-cols-2 gap-6">
  {/* Unassigned Complaints - With its own scrollable container */}
  <div className="bg-white rounded-lg shadow-sm flex flex-col">
    <div className="flex items-center justify-between mt-4 ml-3 gap-2">
      <div className="flex items-center gap-2">
        <img src="complaint.png" alt="" className="h-6.4 w-8" />
        <div className="text-lg border-gray-400 font-medium">Complaints Dashboard</div>
      </div>
      
      {/* Use the enhanced FilterDropdown component */}
      <FilterDropdown setFilters={setFilters} />
    </div>
    
    <div className="text-lg border-gray-400 font-medium p-4 border-b -mt-4"></div>
    
    {/* Add overflow-y-auto and max-h-80 to this container */}
    <div className="overflow-y-auto max-h-80 bg-white rounded-lg">
  {/* Show message if no results match filters */}
  {filteredComplaints.length === 0 && (
    <div className='flex flex-col items-center justify-center h-40 text-gray-500'>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
      <p>No complaints match your filter criteria.</p>
    </div>
  )}
  
  {/* Display filtered complaints */}
  {filteredComplaints.map((complaint) => (
    <div key={complaint.complaint_id} className="mb-3 mx-3 mt-3 p-5 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <div className="flex items-center mb-1 justify-between">
            <h3 className="font-medium text-lg">{complaint.subject}</h3>
            <span className={`ml-3 text-xs px-3 py-1 rounded-full font-medium ${
              complaint.status === "Submitted" ? "bg-yellow-100 text-yellow-800" :
              complaint.status === "Assigned" ? "bg-blue-100 text-blue-800" :
              complaint.status === "Under Review" ? "bg-purple-100 text-purple-800" :
              complaint.status === "In Progress" ? "bg-orange-100 text-orange-800" :
              complaint.status === "Rejected" ? "bg-red-100 text-red-800" :
              "bg-green-100 text-green-800"
            }`}>
              {complaint.status === "Submitted" ? "Unassigned" : complaint.status}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600 mt-3">
            <div className="flex items-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm ">{complaint.hostel_no}</span>
            </div>
            
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm ml-1">{getPriority(complaint.priority)}</span>
            </div>
          </div>
        </div>
        
        {/* Only show assign button for unassigned complaints */}
        {complaint.status === "Submitted" && (
          <button 
            onClick={() => handleOpenAssignModal(complaint)}
            className="px-4 py-2 bg-white border ml-2 border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Assign Engineer
          </button>
        )}
      </div>
    </div>
  ))}
  
  {/* Show message if no complaints at all */}
  {co.length === 0 && (
    <div className="py-12 text-center">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-gray-500 font-medium">No complaints at the moment</p>
      <p className="text-gray-400 text-sm mt-1">When complaints are submitted, they will appear here</p>
    </div>
  )}
</div>
  </div>
        
  {/* Available Engineers - With its own scrollable container */}
  <div className="bg-white rounded-lg shadow-sm flex flex-col">
    <div className="flex items-center justify-between mt-4 ml-3 gap-2">
      <div className="flex items-center gap-2">
        <img src="1.png" alt="" className="h-6.5 w-6.5" />
        <div className="text-lg border-gray-400 font-medium">Engineers</div>
      </div>
      <select
        onChange={(e) => setSelection(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 mr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Specializations</option>
        <option value="Plumbing">Plumbing</option>
        <option value="Internet">Internet</option>
        <option value="Furniture">Furniture</option>
        <option value="Electrical">Electrical</option>
        <option value="Other">Other</option>
      </select>
    </div>
    <div className="text-lg border-gray-400 font-medium p-4 border-b -mt-4"></div>
    
    {/* Add overflow-y-auto and max-h-80 to this container */}
    <div className="overflow-y-auto max-h-80 p-1 space-x-1">
      {en.filter((engineer) => !selection || engineer.specialization === selection).map((engineer) => (
        <div
          onClick={() => handleEngineerClick(engineer)}
          key={engineer.engineer_id}
          className="mb-3 mx-2.5 mt-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 cursor-pointer flex justify-between items-center hover:bg-gray-50" 
        >
          <div className="flex items-center">
            <img
              src="/1.png"
              alt={engineer.name}
              className="w-10 h-10 rounded-full mr-3 border border-gray-500 p-1"
            />
            <div>
              <h3 className="font-medium">{engineer.name}</h3>
              <p className="text-sm text-gray-500">{engineer.specialization}</p>
            </div>
          </div>
          <div>{getStatusBadge(engineer.status)}</div>
        </div>
      ))}
      {en.filter((engineer) => !selection || engineer.specialization === selection).length === 0 && (
        <div className="p-8 text-center text-gray-500">No engineers available for chosen specialization.</div>
      )}
    </div>
  </div>
</div>
{showEngineerModal && selectedEngineer && (
  <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
    <div className="container mx-auto p-4 md:p-6">
      {/* Header with back button */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <button 
          onClick={() => setShowEngineerModal(false)} 
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Engineers
        </button>
        <h2 className="text-xl font-bold">{selectedEngineer.name} - Engineer Profile</h2>
        <div></div> {/* Empty div for flex spacing */}
      </div>
      
      {/* Engineer Profile Section */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <img
            src="/1.png"
            alt={selectedEngineer.name}
            className="w-24 h-24 rounded-full mb-4 md:mb-0 md:mr-6 border-2 border-gray-300 p-1"
          />
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold">{selectedEngineer.name}</h3>
            <div className="mt-2 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
              <p className="text-gray-700">
                <span className="font-medium">Specialization:</span> {selectedEngineer.specialization}
              </p>
              <div>
                {getStatusBadge(selectedEngineer.status)}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              <p className="text-gray-700">
                <span className="font-medium">Email:</span> {selectedEngineer.email || 'engineer@example.com'}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Phone:</span> {selectedEngineer.phone || 'Not available'}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Joined:</span> {selectedEngineer.verification_token_expires_at.slice(0,10) || 'Jan 2023'}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Employee ID:</span> {selectedEngineer.engineer_id}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* co Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* In Progress/Pending co */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Active tasks</h3>
          <div className="space-y-4">
            {co.filter(complaint => 
              complaint.engineer_id === selectedEngineer.engineer_id && 
              (complaint.status !== "Resolved" && complaint.status !== "Rejected")
            ).length > 0 ? (
              co.filter(complaint => 
                complaint.engineer_id === selectedEngineer.engineer_id && 
                (complaint.status !== "Resolved" && complaint.status !== "Rejected")
              ).map(complaint => (
                <div key={complaint.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <h5 className="font-semibold text-lg">{complaint.title || complaint.subject}</h5>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      complaint.status === "In Progress" ? "bg-purple-100 text-purple-800" :
                      complaint.status === "Assigned" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{complaint.description || "No description available"}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-500">
                      <span className="font-medium">Location:</span> {complaint.hostel_no || "Not specified"}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-medium">Priority:</span> {getPriority(complaint.priority) || "Normal"}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-medium">Assigned:</span> {complaint.updated_at.slice(0,10) || "Recently"}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-medium">Expected completion:</span> {tasks.find(task => task.complaint_id === complaint.complaint_id).deadline.slice(0,10) || "Not set"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No active tasks assigned to this engineer.
              </div>
            )}
          </div>
        </div>
        
        {/* Completed co */}
        <div className="bg-white rounded-lg shadow p-6 overflow-y-auto max-h-2xl">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Completed tasks</h3>
          <div className="space-y-4">
            {co.filter(complaint => 
              complaint.engineer_id === selectedEngineer.engineer_id && 
              (complaint.status === "Resolved" || complaint.status === "Rejected")
            ).length > 0 ? (
              co.filter(complaint => 
                complaint.engineer_id === selectedEngineer.engineer_id && 
                (complaint.status === "Resolved" || complaint.status === "Rejected")
              ).map(complaint => (
                <div key={complaint.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <h5 className="font-semibold text-lg">{complaint.title || complaint.subject}</h5>
                    {complaint.status === "Resolved" ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                      Rejected
                    </span>
                    )}
                    
                  </div>
                  <p className="text-gray-600 mt-2">{complaint.description || "No description available"}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-500">
                      <span className="font-semibold">Location:</span> {complaint.hostel_no || "Not specified"}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-semibold">Priority:</span> {getPriority(complaint.priority) || "Normal"}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-semibold">Completed on:</span> {complaint.updated_at.slice(0,10)} on {complaint.updated_at.slice(11)}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-semibold">Deadline:</span> {tasks.find(task => task.complaint_id === complaint.complaint_id).deadline.slice(0,10)|| "Not recorded"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No completed tasks yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
        </main>
      <AssignmentModal 
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedComplaint(null);
        }}
        complaint={selectedComplaint}
        engineers={en}
        onAssign={handleAssignEngineer}
      />
    </div>
  );
};

export default Admin;