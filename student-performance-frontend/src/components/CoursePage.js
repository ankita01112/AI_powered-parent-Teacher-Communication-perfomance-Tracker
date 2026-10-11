import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Plus, Save, Edit, Trash2, X, AlertCircle, CheckCircle } from 'lucide-react';
import Sidebar from './Sidebar';

const CoursePage = () => {
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Get token from localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCourses();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('https://student-performance-api-ankita.onrender.com/api/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch courses:', err);
      showNotification('Failed to fetch courses', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validation
    if (!courseCode.trim() || !courseName.trim()) {
      showNotification('Both Course Code and Course Name are required', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingId) {
        // Update existing course
        await axios.put(
          `https://student-performance-api-ankita.onrender.com/api/courses/${editingId}`,
          { 
            course_code: courseCode.trim(), 
            course_name: courseName.trim() 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification('Course updated successfully!', 'success');
      } else {
        // Create new course
        await axios.post(
          'https://student-performance-api-ankita.onrender.com/api/courses',
          { 
            course_code: courseCode.trim(), 
            course_name: courseName.trim() 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification('Course added successfully!', 'success');
      }

      // Reset form
      setCourseCode('');
      setCourseName('');
      setEditingId(null);
      
      // Refresh courses list
      await fetchCourses();
      
    } catch (err) {
      console.error('❌ Error submitting course:', err);
      
      // Handle different error types
      if (err.response?.status === 401) {
        showNotification('Authentication failed. Please login again.', 'error');
      } else if (err.response?.status === 409) {
        showNotification('Course code already exists. Please use a different code.', 'error');
      } else if (err.response?.status === 422) {
        showNotification('Invalid data provided. Please check your input.', 'error');
      } else if (err.response?.data?.message) {
        showNotification(err.response.data.message, 'error');
      } else {
        showNotification('Error saving course. Please try again.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (course) => {
    setCourseCode(course.course_code);
    setCourseName(course.course_name);
    setEditingId(course.id);
  };

  const handleCancelEdit = () => {
    setCourseCode('');
    setCourseName('');
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await axios.delete(`https://student-performance-api-ankita.onrender.com/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      showNotification('Course deleted successfully!', 'success');
      await fetchCourses();
      
    } catch (err) {
      console.error('❌ Error deleting course:', err);
      
      if (err.response?.status === 401) {
        showNotification('Authentication failed. Please login again.', 'error');
      } else if (err.response?.status === 404) {
        showNotification('Course not found.', 'error');
      } else if (err.response?.data?.message) {
        showNotification(err.response.data.message, 'error');
      } else {
        showNotification('Failed to delete course. Please try again.', 'error');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar />
      <div className="flex-1 p-8 ml-72">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-8 w-8 text-blue-700" />
          <h2 className="text-3xl font-bold text-blue-700">Course Management</h2>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {editingId ? 'Edit Course' : 'Add New Course'}
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Course Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., CS101"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Course Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Introduction to Computer Science"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>
            <div className="flex items-end gap-2">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {editingId ? 'Updating...' : 'Adding...'}
                  </>
                ) : editingId ? (
                  <>
                    <Save className="h-4 w-4" />
                    Update
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Course
                  </>
                )}
              </button>
              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">Course List</h3>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <span className="ml-2 text-gray-600">Loading courses...</span>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Code
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Name
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-gray-500">
                        <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg">No courses available.</p>
                        <p className="text-sm">Add your first course to get started.</p>
                      </td>
                    </tr>
                  ) : (
                    courses.map((course, index) => (
                      <tr key={course.id} className={`hover:bg-gray-50 transition-colors duration-150 ${
                        editingId === course.id ? 'bg-blue-50' : ''
                      }`}>
                        <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                          {index + 1}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900 font-semibold">
                          {course.course_code}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">
                          {course.course_name}
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEdit(course)}
                              disabled={isSubmitting}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(course.id)}
                              disabled={isSubmitting}
                              className="flex items-center gap-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;