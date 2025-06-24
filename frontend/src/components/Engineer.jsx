import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { Check, X, Eye, CheckCircle, ArrowRight, ArrowRightCircle, EyeClosed, EyeClosedIcon, EyeOff, Bell } from 'lucide-react';

function Engineer() {
  const { user, getEngineerTasks, updateTaskStatus, getEngineerCompletedTasks } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [compTasks, setCompTasks] = useState([]);
  const [declineComplaint, setDeclineComplaint] = useState(false);
  const [error, setError] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Group tasks by status
  const pendingTasks = tasks.filter(task => task.status === 'Pending');
  const assignedTasks = tasks.filter(task => task.status === 'Accepted');
  
  // Sample data for the workload chart
  const workloadData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayLabel = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });

    const tasksForDay = tasks.filter(task => {
      const assignedDate = new Date(task.assigned_date);
      return (
        assignedDate.getFullYear() === date.getFullYear() &&
        assignedDate.getMonth() === date.getMonth() &&
        assignedDate.getDate() === date.getDate()
      );
    });

    return {
      day: dayLabel,
      tasks: tasksForDay.length,
      capacity: 10,
    };
  }).reverse();

  useEffect(() => {
    console.log(declineComplaint);
  }, [declineComplaint]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await getEngineerTasks();
      console.log(fetchedTasks);
      setTasks(fetchedTasks);
      generateNotifications(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCompTasks = async () => {
      try {
        setLoading(true);
        const fetchedTasks = await getEngineerCompletedTasks();
        console.log("completed tasks : ", fetchedTasks);
        setCompTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompTasks();
  }, []);

  // Generate notifications based on task deadlines and status
  const generateNotifications = (taskList) => {
    const today = new Date();
    const notificationsList = [];
    
    taskList.forEach(task => {
      const deadline = new Date(task.deadline);
      
      // Check for missed deadlines (past deadline date and not completed)
      if (deadline < today && task.status !== 'Completed') {
        notificationsList.push({
          id: `missed-${task.task_id}`,
          type: 'danger',
          message: `Missed deadline: "${task.description.substring(0, 30)}${task.description.length > 30 ? '...' : ''}"`,
          task_id: task.task_id,
          timestamp: new Date().toISOString()
        });
      }
      // Check for upcoming deadlines (within next 2 days)
      else if (task.status !== 'Completed') {
        const diffTime = deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 2 && diffDays >= 0) {
          notificationsList.push({
            id: `upcoming-${task.task_id}`,
            type: 'warning',
            message: `Task due ${diffDays === 0 ? 'today' : 'tomorrow'}: "${task.description.substring(0, 30)}${task.description.length > 30 ? '...' : ''}"`,
            task_id: task.task_id,
            timestamp: new Date().toISOString()
          });
        }
      }
    });
    
    // Sort notifications by urgency (danger first, then warning) and by timestamp
    notificationsList.sort((a, b) => {
      if (a.type === b.type) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      return a.type === 'danger' ? -1 : 1;
    });
    
    setNotifications(notificationsList);
  };

  const handleTaskAction = async (taskId, status, note) => {
    try {
      setLoading(true);
      if (!note) note = '';
      console.log("note is : ", note);
      await updateTaskStatus(taskId, { status, note });
      // Refresh tasks after updating
      fetchTasks();
    } catch (error) {
      console.error(`Error ${status} task:`, error);
    } finally {
      setLoading(false);
    }
  };

  const getPriority = (priority) => {
    const base = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (priority) {
      case 'Low': return <span className={`${base} bg-green-100 text-green-600`}>{priority} priority</span>;
      case 'Medium': return <span className={`${base} bg-yellow-100 text-yellow-600`}>{priority} priority</span>;
      case 'High': return <span className={`${base} bg-red-100 text-red-600`}>{priority} priority</span>;
      default: return <span className={base}>{priority}</span>;
    }
  };

  const toggleExpandTask = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = (taskId) => {
    // Find the task and expand it
    const taskIndex = tasks.findIndex(task => task.task_id === taskId);
    if (taskIndex !== -1) {
      setExpandedTaskId(taskId);
      
      // Scroll to the task
      setTimeout(() => {
        const taskElement = document.getElementById(`task-${taskId}`);
        if (taskElement) {
          taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          taskElement.classList.add('highlight-task');
          setTimeout(() => {
            taskElement.classList.remove('highlight-task');
          }, 2000);
        }
      }, 100);
    }
    
    setShowNotifications(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
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
        <div className="flex items-center space-x-4">
          <div className="relative">
            {notifications.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
              </div>
            )}
            <button 
              onClick={toggleNotifications} 
              className="h-10 w-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              aria-label="Show notifications"
            >
              <Bell className="h-6 w-6 text-gray-500" />
            </button>
            
            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                <div className="py-2 px-3 bg-gray-100 border-b">
                  <h3 className="text-sm font-medium">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-4 px-3 text-center text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    <div>
                      {notifications.map(notification => (
                        <button
                          key={notification.id}
                          className={`w-full text-left py-3 px-4 border-b border-gray-200 hover:bg-gray-50 flex items-start ${
                            notification.type === 'danger' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-yellow-500'
                          }`}
                          onClick={() => handleNotificationClick(notification.task_id)}
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
            </div>
            <span className="text-sm font-medium">{user?.name || 'User'}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-6 px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-gray-300">
              <div className="bg-yellow-600 h-2.5 w-2.5 rounded-full"></div>Pending Tasks
            </h2>
            {loading && <p className="text-center py-4">Loading tasks...</p>}
            {!loading && pendingTasks.length === 0 && (
              <p className="text-center py-4 text-gray-500">No pending tasks</p>
            )}
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div 
                  id={`task-${task.task_id}`}
                  key={task.task_id} 
                  className="border-b border-gray-200 pb-4 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{task.description}</h3>
                      <p className="text-sm text-gray-500">Due Date: {task.deadline?.slice(0, 10)}</p>
                      <div className="mt-2">{getPriority(task.priority)}</div>
                    </div>
                    <div className='flex-col gap-2'>
                      <div className="flex space-x-2">
                        <button 
                          className="bg-white text-black border px-4 py-1 rounded-full text-sm hover:bg-green-700 hover:bg-opacity-30 hover:text-white duration-200 flex items-center gap-1"
                          onClick={() => handleTaskAction(task.task_id, 'Accepted')}
                          disabled={loading}
                        >
                          Accept <Check className="h-4 w-4" />
                        </button>
                        <button 
                          className={`px-4 py-1 rounded-full text-sm duration-200 flex items-center gap-1 ${
                            declineComplaint 
                              ? "bg-red-700 bg-opacity-30 text-white" 
                              : "bg-white text-black border hover:bg-red-700 hover:bg-opacity-30 hover:text-white"
                          }`}
                          onClick={() => setDeclineComplaint(!declineComplaint)}
                          disabled={loading}
                        >
                          Decline <X className="h-4 w-4" />
                        </button>
                        <button 
                          className="bg-white text-black -ml-2  px-4 py-1 rounded-lg text-base  hover:text-blue-600  duration-200 flex items-center gap-1"
                          onClick={() => toggleExpandTask(task.task_id)}
                        >
                          {expandedTaskId === task.task_id ? 'Hide' : 'View'} {expandedTaskId === task.task_id ? <EyeOff className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                        </button>
                      </div>
                      <div className='mt-3 flex items-center p-1'>
                        {declineComplaint && (
                          <>
                            <p className='text-sm'>Reason: </p>
                            <input 
                              type="text" 
                              required 
                              className={`h-7 ml-2 p-2 text-sm border rounded-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder='Write here....' 
                              value={declineReason}
                              onChange={(e) => {
                                setDeclineReason(e.target.value);
                                if (error) setError(false);
                              }}
                            />
                            <button 
                              onClick={() => {
                                if (declineReason.trim() === '') {
                                  setError(true);
                                } else {
                                  handleTaskAction(task.task_id, 'Declined', declineReason);
                                  setDeclineComplaint(false);
                                  setDeclineReason('');
                                }
                              }}
                              aria-label="Confirm decline reason"
                            >
                              <Check className='h-6 w-6 ml-2 border border-red-600 p-1 rounded-full text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 duration-300' />
                            </button>
                          </>
                        )}
                      </div>
                      {error && declineComplaint && (
                        <p className="text-red-500 text-xs mt-1 ml-16">Reason is required</p>
                      )}
                    </div>
                  </div>
                  
                  {expandedTaskId === task.task_id && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-2">Problem Details:</h4>
                      <p>{task.description || 'No detailed description available'}</p>
                      <div className="mt-3">
                        <p className="text-sm"><strong>Location:</strong> {task.hostel_no || 'Not specified'}</p>
                        <p className="text-sm"><strong>Requester:</strong> {task.email || 'Unknown'}</p>
                        <p className="text-sm"><strong>Contact:</strong> {task.phone_no || 'No contact provided'}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-gray-300">
              <div className="bg-green-600 h-2.5 w-2.5 rounded-full"></div>Accepted Tasks
            </h2>
            {loading && <p className="text-center py-4">Loading tasks...</p>}
            {!loading && assignedTasks.length === 0 && (
              <p className="text-center py-4 text-gray-500">No assigned tasks</p>
            )}
            <div className="space-y-4">
              {assignedTasks.map((task) => (
                <div 
                  id={`task-${task.task_id}`}
                  key={task.task_id} 
                  className="border-b border-gray-200 pb-4 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{task.description}</h3>
                      <p className="text-sm text-gray-500">Due Date: {task.deadline?.slice(0, 10)}</p>
                      <div className="mt-2">{getPriority(task.priority)}</div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="bg-white text-black border px-4 py-1 rounded-full text-sm hover:bg-green-700 hover:bg-opacity-30 hover:text-white duration-200 flex items-center gap-1"
                        onClick={() => handleTaskAction(task.task_id, 'Completed', 'Task completed successfully')}
                        disabled={loading}
                      >
                        Complete <CheckCircle className="h-4 w-4" />
                      </button>
                      <button 
                        className="bg-white text-black border px-4 py-1 rounded-full text-sm hover:bg-blue-700 hover:bg-opacity-30 hover:text-white duration-200 flex items-center gap-1"
                        onClick={() => toggleExpandTask(task.task_id)}
                      >
                        {expandedTaskId === task.task_id ? 'Hide' : 'View'} <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {expandedTaskId === task.task_id && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-2">Problem Details:</h4>
                      <p>{task.description || 'No detailed description available'}</p>
                      <div className="mt-3">
                        <p className="text-sm"><strong>Location:</strong> {task.hostel_no || 'Not specified'}</p>
                        <p className="text-sm"><strong>Requester:</strong> {task.email || 'Unknown'}</p>
                        <p className="text-sm"><strong>Contact:</strong> {task.phone_no || 'No contact provided'}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Workload Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Workload Overview</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={workloadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="#6366F1" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                    name="Tasks"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="capacity" 
                    stroke="#E5E7EB" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Capacity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Priority Matrix */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Priority Matrix</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded">
                <h3 className="text-red-700 font-medium mb-2">Urgent & Important</h3>
                <ul className="text-sm space-y-1">
                  <li>Security Patch Update</li>
                  <li>Critical Bug Fix</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <h3 className="text-yellow-700 font-medium mb-2">Important</h3>
                <ul className="text-sm space-y-1">
                  <li>Code Review</li>
                  <li>Documentation</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="text-blue-700 font-medium mb-2">Urgent</h3>
                <ul className="text-sm space-y-1">
                  <li>Team Meeting</li>
                  <li>Client Demo</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h3 className="text-green-700 font-medium mb-2">Neither</h3>
                <ul className="text-sm space-y-1">
                  <li>Learning Tasks</li>
                  <li>Setup Tasks</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Task History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Task History</h2>
            <div className="space-y-4">
              {tasks.filter(task => (task.status === "Completed" || task.status === "Declined")).map((task) => (
                <div key={task.complaint_id} className="flex items-start space-x-3">
                  {task.status === "Completed" ? ( <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>) : (<div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="h-4 w-4 text-red-600" />
                  </div>)}
                  
                  <div>
                    <h3 className="font-medium">{task.description}</h3>
                    <p className="text-sm text-gray-500">
                      {task.status === "Completed" ? (
                        <>Completed on {task.completion_date ? new Date(task.completion_date).toLocaleDateString() : 'recently'}</>
                      ) : (
                        <>Declined Recently</>  
                      )}
                    </p>
                  </div>
                </div>
              ))}
              {!loading && tasks.filter(task => task.status === "Completed").length === 0 && (
                <p className="text-center py-4 text-gray-500">No completed tasks</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for task highlighting */}
      <style jsx>{`
        @keyframes highlight {
          0% { background-color: rgba(59, 130, 246, 0.1); }
          50% { background-color: rgba(59, 130, 246, 0.2); }
          100% { background-color: transparent; }
        }
        
        .highlight-task {
          animation: highlight 2s ease;
        }
      `}</style>
    </div>
  );
}

export default Engineer;