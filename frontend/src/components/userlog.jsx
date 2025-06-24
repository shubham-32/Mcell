import React, { useState } from 'react';
import { PlusCircle, CheckCircle, Hourglass, X, Clock, FileText, MessageSquare, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const User = () => {
  const [formData, setFormData] = useState({
      fullName: '',
      rollNo: '',
      email: '',
      phoneNo: '',
      hostelNo: '',
      roomNo: '',
      problemType: 'Electrical',
      problemDescription: '',
      priorityLevel: '',
      files: []
    });
  
    const [currentStep, setCurrentStep] = useState(1);
    const [complaints, setComplaints] = useState([
      { 
        id: 12345, 
        subject: 'Network Issues', 
        status: 'Resolved', 
        date: '2024-01-15',
        description: 'Frequent network disconnections during peak hours affecting productivity.',
        timeline: [
          { status: 'Submitted', date: '2024-01-12', note: 'Complaint filed through the customer portal' },
          { status: 'Under Review', date: '2024-01-13', note: 'Assigned to network team' },
          { status: 'In Progress', date: '2024-01-14', note: 'Network team investigating the issue' },
          { status: 'Resolved', date: '2024-01-15', note: 'Router configuration updated and issue resolved' }
        ]
      },
      { 
        id: 12346, 
        subject: 'Software Bug', 
        status: 'In Progress', 
        date: '2024-01-16',
        description: 'Application crashes when generating monthly reports.',
        timeline: [
          { status: 'Submitted', date: '2024-01-16', note: 'Complaint filed through the customer portal' },
          { status: 'Under Review', date: '2024-01-16', note: 'Assigned to software department' },
          { status: 'In Progress', date: '2024-01-16', note: 'Development team working on the issue' }
        ]
      },
      { 
        id: 12347, 
        subject: 'Hardware Failure', 
        status: 'Under Review', 
        date: '2024-01-17',
        description: 'Workstation shutting down unexpectedly during use.',
        timeline: [
          { status: 'Submitted', date: '2024-01-17', note: 'Complaint filed through the customer portal' },
          { status: 'Under Review', date: '2024-01-17', note: 'Assigned to hardware support team' }
        ]
      },
      { 
        id: 12348, 
        subject: 'Service Request', 
        status: 'Pending', 
        date: '2024-01-18',
        description: 'Request for additional user licenses for the project management software.',
        timeline: [
          { status: 'Submitted', date: '2024-01-18', note: 'Request filed through the service portal' },
          { status: 'Pending', date: '2024-01-18', note: 'Awaiting approval from management' }
        ]
      },
    ]);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };
  
    const handleFileChange = (e) => {
      setFormData({
        ...formData,
        files: e.target.files
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Add new complaint to the list
      const newComplaint = {
        id: Math.floor(10000 + Math.random() * 90000).toString(),
        subject: formData.problemType,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
      };
      
      setComplaints([...complaints, newComplaint]);
      
      // Reset form
      setFormData({
        fullName: '',
        rollNo: '',
        email: '',
        phoneNo: '',
        hostelNo: '',
        roomNo: '',
        problemType: 'Electrical',
        problemDescription: '',
        priorityLevel: '',
        files: []
      });
      
      // Go back to step 1
      setCurrentStep(1);
    };
  
    const handleNextStep = () => {
      setCurrentStep(currentStep + 1);
    };
  
    const handlePrevStep = () => {
      setCurrentStep(currentStep - 1);
    };

  const {user} = useAuthStore();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [submitView , setSubmitView] = useState(false);
  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
  };
  const handleSubmitView = () => {
    setSubmitView(!submitView)
  }
  const handleBackToDashboard = () => {
    setSelectedComplaint(null);
  };

  const getStatusBadge = (status) => {
    const base = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'Resolved': return <span className={`${base} bg-green-100 text-green-600`}>{status}</span>;
      case 'In Progress': return <span className={`${base} bg-yellow-100 text-yellow-600`}>{status}</span>;
      case 'Under Review': return <span className={`${base} bg-blue-100 text-blue-600`}>{status}</span>;
      case 'Pending': return <span className={`${base} bg-gray-100 text-gray-600`}>{status}</span>;
      case 'Submitted': return <span className={`${base} bg-purple-100 text-purple-600`}>{status}</span>;
      default: return <span className={base}>{status}</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved': return <CheckCircle size={20} className="text-green-600" />;
      case 'In Progress': return <Hourglass size={20} className="text-yellow-600" />;
      case 'Under Review': return <FileText size={20} className="text-blue-600" />;
      case 'Pending': return <Clock size={20} className="text-gray-600" />;
      case 'Submitted': return <MessageSquare size={20} className="text-purple-600" />;
      default: return <Clock size={20} />;
    }
  };

  if (selectedComplaint) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button 
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-gray-600 mb-6 hover:text-black transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-1">Complaint #{selectedComplaint.id}</h1>
            <p className="text-lg mb-2">{selectedComplaint.subject}</p>
            <div className="mb-4">{getStatusBadge(selectedComplaint.status)}</div>
            <p className="text-gray-700 mb-6">{selectedComplaint.description}</p>
            
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">Complaint Timeline</h2>
              <div className="space-y-6">
                {selectedComplaint.timeline.map((event, index) => (
                  <div key={index} className="relative pl-8 pb-6">
                    <div className="absolute left-0 top-0 h-full w-px bg-gray-200"></div>
                    <div className="absolute left-0 top-0 -ml-2 p-1 bg-white z-10">
                      {getStatusIcon(event.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{event.status}</p>
                        <span className="text-sm text-gray-500">{event.date}</span>
                      </div>
                      <p className="text-gray-600 mt-1">{event.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Add Comment</h3>
              <textarea 
                className="w-full border border-gray-300 rounded p-2 mb-2" 
                rows="3" 
                placeholder="Type your comment here..."
              ></textarea>
              <button className="bg-black text-white px-4 py-2 rounded font-medium">
                Submit Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white text-black py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link to="/">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-10 w-10 mr-3" />
            <span className="text-xl font-bold text-gray-900">M-Cell</span>
          </div>
        </Link>
          
          
          <div className="text-lg">Welcome back, {user.name} </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Bar - Now in a single row */}
        <div className="flex flex-wrap mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="w-1/3 p-4 border-r border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Active Complaints</p>
            <p className="text-2xl font-bold">3</p>
          </div>
          <div className="w-1/3 p-4 border-r border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Resolved</p>
            <p className="text-2xl font-bold text-green-600">12</p>
          </div>
          <div className="w-1/3 p-4 border-r border-gray-200">
            <p className="text-sm text-gray-500 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">2</p>
          </div>
          {/* <div className="w-1/4 p-4">
            <p className="text-sm text-gray-500 mb-1">Feedback</p>
            <p className="text-2xl font-bold text-purple-600">4.5</p>
          </div> */}
        </div>

        <div className="mb-8">
          <button className="w-full bg-black text-white py-3 rounded-lg flex justify-center items-center gap-2 font-medium hover:bg-gray-900 transition-colors"
          onClick={handleSubmitView}
          >
            <PlusCircle size={18} /> {submitView ? "Cancel" : "Submit a complaint"}
          </button>
        </div>
        {submitView && 
          (<div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold flex justify-between items-center">
              Submit Complaint
              <span className="text-sm font-normal text-gray-500">
                Step {currentStep} of 3
              </span>
            </h2>
            <div className="mt-4 mb-8">
              <div className="flex">
                <div className={`h-2 flex-1 ${currentStep >= 1 ? 'bg-black' : 'bg-gray-200'}`}></div>
                <div className={`h-2 flex-1 ${currentStep >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
                <div className={`h-2 flex-1 ${currentStep >= 3 ? 'bg-black' : 'bg-gray-200'}`}></div>
              </div>
            </div>
          </div>

          {currentStep === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll No</label>
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone No</label>
                  <input
                    type="tel"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hostel No</label>
                  <input
                    type="text"
                    name="hostelNo"
                    value={formData.hostelNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room No</label>
                  <input
                    type="text"
                    name="roomNo"
                    value={formData.roomNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Next Step
                </button>
              </div>
            </form>
          )}

          {currentStep === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Problem Type</label>
                  <select
                    name="problemType"
                    value={formData.problemType}
                    onChange={handleInputChange}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Problem Description</label>
                  <textarea
                    name="problemDescription"
                    value={formData.problemDescription}
                    onChange={handleInputChange}
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Priority Level</label>
                  <div className="flex space-x-6">
                    <div className="flex items-center">
                      <input
                        id="priority-low"
                        name="priorityLevel"
                        type="radio"
                        value="Low"
                        checked={formData.priorityLevel === 'Low'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="priority-low" className="ml-2 text-sm text-gray-700">
                        Low
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="priority-medium"
                        name="priorityLevel"
                        type="radio"
                        value="Medium"
                        checked={formData.priorityLevel === 'Medium'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="priority-medium" className="ml-2 text-sm text-gray-700">
                        Medium
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="priority-high"
                        name="priorityLevel"
                        type="radio"
                        value="High"
                        checked={formData.priorityLevel === 'High'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="priority-high" className="ml-2 text-sm text-gray-700">
                        High
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Next Step
                </button>
              </div>
            </form>
          )}

          {currentStep === 3 && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                  <div className="mt-1 border-2 border-dashed border-gray-300 rounded-md px-6 pt-5 pb-6 flex justify-center">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="files"
                            type="file"
                            multiple
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Previous
                </button>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>)

        }

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold p-4 border-b border-gray-300">Recent Activity</h2>
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle size={20} />
              <div>
                <p className="font-medium">Complaint #12345 Resolved</p>
                <p className="text-sm text-gray-500">2024-01-15</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-yellow-600">
              <Hourglass size={20} />
              <div>
                <p className="font-medium">Complaint #12346 In Progress</p>
                <p className="text-sm text-gray-500">2024-01-16</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Your Complaints</h2>
            <select className="border p-2 rounded text-sm">
              <option>All Complaints</option>
              <option>Resolved</option>
              <option>In Progress</option>
              <option>Under Review</option>
              <option>Pending</option>
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
                {complaints.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-semibold">#{item.id}</td>
                    <td className="py-3 px-4">{item.subject}</td>
                    <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-4">{item.date}</td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleViewComplaint(item)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        View Details
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-400 text-right">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm">
              View All Complaints
            </button>
          </div>
        </div>
      </main>
      
      
    </div>
  );
};

export default User;