import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GraduationCap, Plus, Save, Edit, Trash2, X, AlertCircle, CheckCircle } from 'lucide-react';
import Sidebar from './Sidebar';

const MarksPage = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    student_id: '',
    subject_id: '',
    marks_obtained: '',
    total_marks: '',
    exam_date: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
    fetchMarks();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get('https://student-performance-api-ankita.onrender.com/api/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error('❌ Error fetching students:', err);
      showNotification('Failed to fetch students', 'error');
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get('https://student-performance-api-ankita.onrender.com/api/subjects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data);
    } catch (err) {
      console.error('❌ Error fetching subjects:', err);
      showNotification('Failed to fetch subjects', 'error');
    }
  };

  const fetchMarks = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('https://student-performance-api-ankita.onrender.com/api/marks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMarks(res.data);
    } catch (err) {
      console.error('❌ Error fetching marks:', err);
      showNotification('Failed to fetch marks', 'error');
    } finally {
      setIsLoading(false);
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
    if (!formData.student_id || !formData.subject_id || !formData.marks_obtained || !formData.total_marks || !formData.exam_date) {
      showNotification('All fields are required', 'error');
      return;
    }

    if (parseInt(formData.marks_obtained) > parseInt(formData.total_marks)) {
      showNotification('Marks obtained cannot exceed total marks', 'error');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      student_id: parseInt(formData.student_id),
      subject_id: parseInt(formData.subject_id),
      marks_obtained: parseInt(formData.marks_obtained),
      total_marks: parseInt(formData.total_marks),
      exam_date: formData.exam_date,
    };

    try {
      if (editId) {
        await axios.put(`https://student-performance-api-ankita.onrender.com/api/marks/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification('Marks updated successfully!', 'success');
      } else {
        await axios.post('https://student-performance-api-ankita.onrender.com/api/marks', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification('Marks added successfully!', 'success');
      }

      resetForm();
      await fetchMarks();
    } catch (err) {
      console.error('❌ Submit failed:', err);
      
      // Handle different error types
      if (err.response?.status === 401) {
        showNotification('Authentication failed. Please login again.', 'error');
      } else if (err.response?.status === 409) {
        showNotification('Marks record already exists for this student and subject.', 'error');
      } else if (err.response?.status === 422) {
        showNotification('Invalid data provided. Please check your input.', 'error');
      } else if (err.response?.data?.message) {
        showNotification(err.response.data.message, 'error');
      } else {
        showNotification('Error saving marks. Please try again.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (mark) => {
    setFormData({
      student_id: mark.student_id,
      subject_id: mark.subject_id,
      marks_obtained: mark.marks_obtained,
      total_marks: mark.total_marks,
      exam_date: mark.exam_date.split('T')[0],
    });
    setEditId(mark.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mark record?')) return;

    try {
      await axios.delete(`https://student-performance-api-ankita.onrender.com/api/marks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      showNotification('Mark record deleted successfully!', 'success');
      await fetchMarks();
    } catch (err) {
      console.error('❌ Delete failed:', err);
      
      if (err.response?.status === 401) {
        showNotification('Authentication failed. Please login again.', 'error');
      } else if (err.response?.status === 404) {
        showNotification('Mark record not found.', 'error');
      } else if (err.response?.data?.message) {
        showNotification(err.response.data.message, 'error');
      } else {
        showNotification('Failed to delete mark record. Please try again.', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      subject_id: '',
      marks_obtained: '',
      total_marks: '',
      exam_date: '',
    });
    setEditId(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const getPercentage = (obtained, total) => {
    if (!obtained || !total) return 0;
    return ((obtained / total) * 100).toFixed(1);
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 75) return 'bg-blue-100 text-blue-800';
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
    if (percentage >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
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
          <GraduationCap className="h-8 w-8 text-blue-700" />
          <h2 className="text-3xl font-bold text-blue-700">Student Marks Management</h2>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {editId ? 'Edit Mark Record' : 'Add New Mark Record'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Student <span className="text-red-500">*</span>
              </label>
              <select
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                name="subject_id"
                value={formData.subject_id}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject_code} - {subject.subject_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Marks Obtained <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="marks_obtained"
                value={formData.marks_obtained}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="e.g., 85"
                min="0"
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Total Marks <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="total_marks"
                value={formData.total_marks}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="e.g., 100"
                min="1"
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Exam Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="exam_date"
                value={formData.exam_date}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
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
                  Update Marks
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Marks
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
            <h3 className="text-lg font-semibold text-gray-700">Marks Records</h3>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <span className="ml-2 text-gray-600">Loading marks...</span>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marks
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam Date
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {marks.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-gray-500">
                        <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg">No marks records available.</p>
                        <p className="text-sm">Add your first mark record to get started.</p>
                      </td>
                    </tr>
                  ) : (
                    marks.map((mark, index) => {
                      const percentage = getPercentage(mark.marks_obtained, mark.total_marks);
                      return (
                        <tr key={mark.id} className={`hover:bg-gray-50 transition-colors duration-150 ${
                          editId === mark.id ? 'bg-blue-50' : ''
                        }`}>
                          <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                            {index + 1}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {mark.first_name ?? 'Unknown'} {mark.last_name ?? ''}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            <div className="flex flex-col">
                              <span className="font-medium">{mark.subject_code}</span>
                              <span className="text-xs text-gray-500">{mark.subject_name ?? 'N/A'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            <div className="flex flex-col">
                              <span className="font-semibold text-lg">
                                {mark.marks_obtained}/{mark.total_marks}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(percentage)}`}>
                              {percentage}%
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {new Date(mark.exam_date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-sm">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleEdit(mark)}
                                disabled={isSubmitting}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(mark.id)}
                                disabled={isSubmitting}
                                className="flex items-center gap-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
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

export default MarksPage;