import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSem, setSelectedSem] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCourses();
    fetchStudents(); // Initial load
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data);
    } catch (err) {
      console.error('❌ Failed to load courses', err);
    }
  };

  const fetchSemesters = async (courseId) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/semesters?course_id=${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSemesters(res.data);
    } catch (err) {
      console.error('❌ Failed to load semesters', err);
    }
  };

  const fetchStudents = async (courseId = null, semesterId = null) => {
    setLoading(true);
    try {
      let url = 'http://localhost:4000/api/students';
      if (courseId && semesterId) {
        url = `http://localhost:4000/api/students?course_id=${courseId}&semester_id=${semesterId}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStudents(res.data);
    } catch (err) {
      console.error('❌ Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setSelectedSem('');
    setStudents([]);
    setSemesters([]);
    if (courseId) {
      await fetchSemesters(courseId);
    }
  };

  const handleSemesterChange = async (e) => {
    const semId = e.target.value;
    setSelectedSem(semId);
    if (selectedCourse && semId) {
      await fetchStudents(selectedCourse, semId);
    }
  };

  const openEditModal = async (student) => {
    setEditing(student.id);
    setForm({
      ...student,
      course_id: student.course_id || '',
      semester_id: student.semester_id || ''
    });
    await fetchSemesters(student.course_id);
  };

  const closeModal = () => {
    setEditing(null);
    setForm({});
    setMsg('');
  };

  const handleEditChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:4000/api/students/${editing}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('✅ Student updated successfully');
      closeModal();
      fetchStudents(selectedCourse, selectedSem);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('❌ Update failed');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`http://localhost:4000/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents(selectedCourse, selectedSem);
      setMsg('✅ Student deleted successfully');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert('Failed to delete student');
    }
  };

  const getPerformanceColor = (score) => {
    if (!score || score === 'N/A') return 'text-gray-400';
    const numScore = parseFloat(score);
    if (numScore >= 85) return 'text-green-600 font-semibold';
    if (numScore >= 70) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  const getAttendanceColor = (attendance) => {
    if (!attendance || attendance === 'N/A') return 'text-gray-400';
    const numAttendance = parseFloat(attendance);
    if (numAttendance >= 90) return 'text-green-600 font-semibold';
    if (numAttendance >= 75) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const email = student.email?.toLowerCase() || '';
    const studentId = student.student_id?.toString() || '';
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) || 
           email.includes(searchLower) || 
           studentId.includes(searchLower);
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar />
      <div className="flex-1 p-2 ml-72">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center p-4 justify-between mb-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                Student Management
              </h2>
              <p className="text-gray-600">Manage and track student performance</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="text-sm text-gray-500">Total Students</div>
              <div className="text-2xl font-bold text-blue-600">{filteredStudents.length}</div>
            </div>
          </div>
          
          {/* Success/Error Messages */}
          {msg && (
            <div className={`mb-4 p-4 rounded-lg border-l-4 transition-all duration-300 ${
              msg.includes('✅') 
                ? 'bg-green-50 border-green-400 text-green-700' 
                : 'bg-red-50 border-red-400 text-red-700'
            }`}>
              {msg}
            </div>
          )}
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Students</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <svg className="absolute right-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Course Select */}
            <select 
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
              value={selectedCourse} 
              onChange={handleCourseChange}
            >
              <option value="">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.course_name}</option>
              ))}
            </select>

            {/* Semester Select */}
            <select
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={selectedSem}
              onChange={handleSemesterChange}
              disabled={!selectedCourse}
            >
              <option value="">All Semesters</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>Semester {s.semester_number}</option>
              ))}
            </select>

            {/* Reset Button */}
            <button
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm"
              onClick={() => {
                setSelectedCourse('');
                setSelectedSem('');
                setSearchTerm('');
                fetchStudents();
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Loading students...</span>
          </div>
        )}

        {/* Students Table */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Student ID</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Course</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Sem</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700">Attendance</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700">Avg Score</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700">AI Prediction</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <p className="text-lg font-medium">No students found</p>
                          <p className="text-sm">Try adjusting your filters or search criteria</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s, index) => (
                      <tr key={s.id} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">{s.student_id}</td>
                        <td className="py-4 px-6">
                          <div className="text-sm font-medium text-gray-900">{s.first_name} {s.last_name}</div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{s.email}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{s.course_name || 'N/A'}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{s.semester_number || 'N/A'}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`text-sm ${getAttendanceColor(s.attendance)}`}>
                            {s.attendance ? `${s.attendance}%` : 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`text-sm ${getPerformanceColor(s.avg_test_score)}`}>
                            {s.avg_test_score || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            s.last_prediction === 'Pass' ? 'bg-green-100 text-green-800' :
                            s.last_prediction === 'Fail' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {s.last_prediction || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            <button 
                              onClick={() => openEditModal(s)} 
                              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteStudent(s.id)} 
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                            >
                              Delete
                            </button>
                            <Link
                              to={`/prediction?student_id=${s.id}`}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 inline-block"
                            >
                              <Sparkles size={15} />
                              AI
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 transform transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">✏️ Edit Student</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    name="first_name" 
                    value={form.first_name || ''} 
                    onChange={handleEditChange} 
                    placeholder="First Name" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                  />
                  <input 
                    type="text" 
                    name="last_name" 
                    value={form.last_name || ''} 
                    onChange={handleEditChange} 
                    placeholder="Last Name" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                  />
                </div>
                
                <input 
                  type="email" 
                  name="email" 
                  value={form.email || ''} 
                  onChange={handleEditChange} 
                  placeholder="Email" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                />

                <select 
                  name="course_id" 
                  value={form.course_id || ''} 
                  onChange={handleEditChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.course_name}</option>
                  ))}
                </select>

                <select 
                  name="semester_id" 
                  value={form.semester_id || ''} 
                  onChange={handleEditChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Semester</option>
                  {semesters.map((s) => (
                    <option key={s.id} value={s.id}>Semester {s.semester_number}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end mt-8 space-x-3">
                <button 
                  onClick={closeModal} 
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveEdit} 
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 transform hover:scale-105 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;