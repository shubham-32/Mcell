import React from "react";
import { useState } from 'react';
// import { CloudUploadIcon } from '@heroicons/react/outline';

function SubmitComplain() {
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
    { id: '12345', subject: 'Network Issues', status: 'Resolved', date: '2024-01-15' },
    { id: '12346', subject: 'Software Bug', status: 'In Progress', date: '2024-01-16' },
    { id: '12347', subject: 'Hardware Failure', status: 'Under Review', date: '2024-01-17' },
    { id: '12348', subject: 'Service Request', status: 'Pending', date: '2024-01-18' }
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



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold">User Dashboard</h1>
            <p className="text-gray-600">Welcome back, John Doe | Last login: Today at 9:30 AM</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
        </div>
      </div>
    </div>
  );
}

export default SubmitComplain;