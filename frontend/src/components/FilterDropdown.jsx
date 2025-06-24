import React, { useState, useEffect } from 'react';

// Enhanced FilterDropdown component with modern pill-style selections
const FilterDropdown = ({ setFilters }) => {
  // State to track selected options within the dropdown
  const [selectedOptions, setSelectedOptions] = useState({
    status: ["Submitted"],
    priority: [],
    subject: []
  });
  
  // Track dropdown visibility
  const [isOpen, setIsOpen] = useState(false);

  // Update parent filters when selections change
  useEffect(() => {
    setFilters({
      status: selectedOptions.status.length > 0 ? selectedOptions.status : null,
      priority: selectedOptions.priority.length > 0 ? selectedOptions.priority : null,
      subject: selectedOptions.subject.length > 0 ? selectedOptions.subject : null
    });
  }, [selectedOptions, setFilters]);

  // Toggle an option's selection state
  const toggleOption = (filterType, value) => {
    setSelectedOptions(prev => {
      const currentValues = [...prev[filterType]];
      const valueIndex = currentValues.indexOf(value);
      
      if (valueIndex === -1) {
        // Add value if not present
        return {
          ...prev,
          [filterType]: [...currentValues, value]
        };
      } else {
        // Remove value if already selected
        currentValues.splice(valueIndex, 1);
        return {
          ...prev,
          [filterType]: currentValues
        };
      }
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedOptions({
      status: ["Submitted"],
      priority: [],
      subject: []
    });
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Calculate total active filters for the badge
  const totalActiveFilters = 
    selectedOptions.status.length + 
    selectedOptions.priority.length + 
    selectedOptions.subject.length;

  // Option components for each filter type
  const renderFilterOptions = (filterType, options) => {
    return (
      <div className="grid grid-cols-2 gap-2">
        {options.map(option => (
          <div 
            key={option}
            onClick={() => toggleOption(filterType, option)}
            className={`py-2 rounded-full text-center text-xs cursor-pointer transition-all duration-200 ${
              selectedOptions[filterType].includes(option) 
                ? 'bg-blue-500  text-white' 
                : ' border border-blue-600 hover:bg-gray-100 text-gray-700'
            }`}
          >
            {filterType === 'status' && option === 'Submitted' ? 'Unassigned' : option}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative">
      <button
        className="flex items-center border border-gray-300 rounded-lg px-3 py-2 mr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 transition-colors"
        onClick={toggleDropdown}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {totalActiveFilters > 0 && (
          <span className="ml-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {totalActiveFilters}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 w-72">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">Filter Options</h3>
            <button 
              onClick={clearAllFilters}
              className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Status Filters */}
          <div className="p-3 border-b border-gray-200">
            <h4 className="font-medium mb-2 text-sm text-gray-700">Status</h4>
            {renderFilterOptions('status', ["Submitted", "Under Review", "In Progress", "Resolved"])}
          </div>

          {/* Priority Filters */}
          <div className="p-3 border-b border-gray-200">
            <h4 className="font-medium mb-2 text-sm text-gray-700">Priority</h4>
            {renderFilterOptions('priority', ["High", "Medium", "Low"])}
          </div>

          {/* Subject Filters - Uncomment and modify as needed */}
          {/* <div className="p-3 border-b border-gray-200">
            <h4 className="font-medium mb-2 text-sm text-gray-700">Subject</h4>
            {renderFilterOptions('subject', ["Plumbing", "Internet", "Furniture", "Electrical", "Other"])}
          </div> */}

          {/* Apply Filters Button */}
          <div className="p-3">
            <button
              onClick={toggleDropdown}
              className="w-full py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;