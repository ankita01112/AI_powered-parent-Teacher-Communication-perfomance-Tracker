import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, Plus, Save, Edit, Trash2, X, AlertCircle, CheckCircle } from 'lucide-react';
import Sidebar from './Sidebar';

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [formData, setFormData] = useState({
    subject_code: '',
    subject_name: '',
    course: '',
    semester: '',
  });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSubjects();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (formData.course) {
      fetchSemesters(formData.course);
    } else {
      setSemesters([]);
    }
  }, [formData.course]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('https://student-performance-api-ankita.onrender.com/api/subjects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data);
    } catch (err) {
      console.error('❌ Error fetching subjects:', err);
      showNotification('Failed to fetch subjects', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get('https://student-performance-api-ankita.onrender.com/api/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      console.error('❌ Error fetching courses:', err);
      showNotification('Failed to fetch courses', 'error');
    }
  };

  const fetchSemesters = async (courseId) => {
    try {
      const res = await axios.get(`https://student-performance-api-ankita.onrender.com/api/semesters?course_id=${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSemesters(res.data);
    } catch (err) {
      console.error('❌ Error fetching semesters:', err);
      showNotification('Failed to fetch semesters', 'error');
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Validation
    if (!formData.subject_code.trim() || !formData.subject_name.trim() || !formData.course || !formData.semester) {
      showNotification('All fields are required', 'error');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      subject_code: formData.subject_code.trim(),
      subject_name: formData.subject_name.trim(),
      course: parseInt(formData.course),
      semester: parseInt(formData.semester),
    };

    try {
      if (editId) {
        await axios.put(`https://student-performance-api-ankita.onrender.com/api/subjects/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification('Subject updated successfully!', 'success');
      } else {
        await axios.post('https://student-performance-api-ankita.onrender.com/api/subjects', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification('Subject added successfully!', 'success');
      }
      
      resetForm();
      await fetchSubjects();
    } catch (err) {
      console.error('❌ Submit failed:', err);
      
      // Handle different error types
      if (err.response?.status === 401) {
        showNotification('Authentication failed. Please login again.', 'error');
      } else if (err.response?.status === 409) {
        showNotification('Subject code already exists. Please use a different code.', 'error');
      } else if (err.response?.status === 422) {
        showNotification('Invalid data provided. Please check your input.', 'error');
      } else if (err.response?.data?.message) {
        showNotification(err.response.data.message, 'error');
      } else {
        showNotification('Error saving subject. Please try again.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (subject) => {
    setFormData({
      subject_code: subject.subject_code,
      subject_name: subject.subject_name,
      course: subject.course,
      semester: subject.semester,
    });
    setEditId(subject.id);
    fetchSemesters(subject.course);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    
    try {
      await axios.delete(`https://student-performance-api-ankita.onrender.com/api/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      showNotification('Subject deleted successfully!', 'success');
      await fetchSubjects();
    } catch (err) {
      console.error('❌ Delete failed:', err);
      
      if (err.response?.status === 401) {
        showNotification('Authentication failed. Please login again.', 'error');
      } else if (err.response?.status === 404) {
        showNotification('Subject not found.', 'error');
      } else if (err.response?.data?.message) {
        showNotification(err.response.data.message, 'error');
      } else {
        showNotification('Failed to delete subject. Please try again.', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      subject_code: '',
      subject_name: '',
      course: '',
      semester: '',
    });
    setEditId(null);
    setSemesters([]);
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
          <h2 className="text-3xl font-bold text-blue-700">Subject Management</h2>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {editId ? 'Edit Subject' : 'Add New Subject'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Subject Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject_code"
                value={formData.subject_code}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="e.g., CS101"
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Subject Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject_name"
                value={formData.subject_name}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Data Structures"
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.course_code} - {c.course_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Semester <span className="text-red-500">*</span>
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                disabled={!formData.course || isSubmitting}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">Select Semester</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.semester_number}>
                    Semester {s.semester_number}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {editId ? 'Updating...' : 'Adding...'}
                </>
              ) : editId ? (
                <>
                  <Save className="h-4 w-4" />
                  Update Subject
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Subject
                </>
              )}
            </button>
            {editId && (
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

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">Subject List</h3>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <span className="ml-2 text-gray-600">Loading subjects...</span>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject Code
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject Name
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semester
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subjects.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500">
                        <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg">No subjects available.</p>
                        <p className="text-sm">Add your first subject to get started.</p>
                      </td>
                    </tr>
                  ) : (
                    subjects.map((subject, index) => (
                      <tr key={subject.id} className={`hover:bg-gray-50 transition-colors duration-150 ${
                        editId === subject.id ? 'bg-blue-50' : ''
                      }`}>
                        <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                          {index + 1}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900 font-semibold">
                          {subject.subject_code}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">
                          {subject.subject_name}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">
                          <div className="flex flex-col">
                            <span className="font-medium">{subject.course_code}</span>
                            <span className="text-xs text-gray-500">{subject.course_name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Semester {subject.semester_number}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEdit(subject)}
                              disabled={isSubmitting}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(subject.id)}
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

export default SubjectsPage;