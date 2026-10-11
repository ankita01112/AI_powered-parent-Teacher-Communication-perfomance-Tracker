import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { Calendar, Users, BookOpen, GraduationCap, Check, X, Search, Save, AlertCircle, CheckCircle2, Clock, User } from 'lucide-react';

const AttendancePage = () => {
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Helper to auto include JWT token
  const axiosWithAuth = () => {
    // In a real implementation, you would get the token from localStorage
    // For this demo, we'll use a placeholder or you can replace with your actual token handling
    const token = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('token') : null;
    return axios.create({
      baseURL: 'https://student-performance-api-ankita.onrender.com/api',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
  };

  useEffect(() => {
    fetchCourses();
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setMsg('');
      const res = await axiosWithAuth().get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('❌ Error fetching courses:', err.response?.data || err.message);
      setMsg(`❌ Error loading courses: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchSemesters = async (courseId) => {
    try {
      setLoading(true);
      setMsg('');
      const res = await axiosWithAuth().get(`/semesters?course_id=${courseId}`);
      setSemesters(res.data);
    } catch (err) {
      console.error('❌ Error fetching semesters:', err.response?.data || err.message);
      setMsg(`❌ Error loading semesters: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setSelectedSemester('');
    setSemesters([]);
    setStudents([]);
    setAttendance({});
    setMsg('');
    if (courseId) {
      await fetchSemesters(courseId);
    }
  };

  const fetchStudents = async () => {
    if (!selectedCourse || !selectedSemester) return;
    try {
      setLoading(true);
      setMsg('');
      const res = await axiosWithAuth().get(`/students/filter?course_id=${selectedCourse}&semester_id=${selectedSemester}`);
      setStudents(res.data);
      if (res.data.length === 0) {
        setMsg('ℹ️ No students found for the selected course and semester');
      }
    } catch (err) {
      console.error('❌ Error fetching students:', err.response?.data || err.message);
      setMsg(`❌ Error loading students: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status });
  };

  const handleSubmit = async () => {
    const entries = Object.entries(attendance);

    if (!date || entries.length === 0) {
      setMsg('❌ Please select a date and mark attendance for at least one student');
      return;
    }

    try {
      setLoading(true);
      setMsg('');
      
      // Submit attendance for each student
      const promises = entries.map(([studentId, status]) =>
        axiosWithAuth().post('/attendance', {
          student_id: parseInt(studentId),
          date,
          status,
        })
      );

      await Promise.all(promises);
      setMsg('✅ Attendance submitted successfully');
      setAttendance({});
      
      // Clear message after 5 seconds
      setTimeout(() => setMsg(''), 5000);
    } catch (err) {
      console.error('❌ Failed to submit attendance:', err.response?.data || err.message);
      setMsg(`❌ Failed to submit attendance: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const markAllPresent = () => {
    const newAttendance = {};
    filteredStudents.forEach(student => {
      newAttendance[student.id] = 'Present';
    });
    setAttendance(newAttendance);
  };

  const markAllAbsent = () => {
    const newAttendance = {};
    filteredStudents.forEach(student => {
      newAttendance[student.id] = 'Absent';
    });
    setAttendance(newAttendance);
  };

  const clearAll = () => {
    setAttendance({});
  };

  const filteredStudents = students.filter(student => 
    searchTerm === '' || 
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttendanceStats = () => {
    const totalMarked = Object.keys(attendance).length;
    const presentCount = Object.values(attendance).filter(status => status === 'Present').length;
    const absentCount = Object.values(attendance).filter(status => status === 'Absent').length;
    const totalStudents = filteredStudents.length;
    
    return { totalMarked, presentCount, absentCount, totalStudents };
  };

  const stats = getAttendanceStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar />
      <div className="flex-1 p-2 ml-72">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Attendance Management</h1>
          </div>
          <p className="text-gray-600">Mark and track student attendance efficiently</p>
        </div>

        {/* Course and Semester Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Course Selection
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-1" />
                Course
              </label>
              <select
                value={selectedCourse}
                onChange={handleCourseChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={loading}
              >
                <option value="">-- Select Course --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.course_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <GraduationCap className="w-4 h-4 inline mr-1" />
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={!selectedCourse || loading}
              >
                <option value="">-- Select Semester --</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>Semester {s.semester_number}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchStudents}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={!selectedSemester || loading}
              >
                <Search className="w-4 h-4" />
                {loading ? 'Loading...' : 'Load Students'}
              </button>
            </div>
          </div>
        </div>

        {/* Date Selection and Stats */}
        {students.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Date Selection
              </h3>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Attendance Summary
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalMarked}</div>
                  <div className="text-sm text-gray-600">Marked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.presentCount}</div>
                  <div className="text-sm text-gray-600">Present</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.absentCount}</div>
                  <div className="text-sm text-gray-600">Absent</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Message Display */}
        {msg && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            msg.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {msg.includes('✅') ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {msg}
          </div>
        )}

        {/* Student List */}
        {students.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Student List ({filteredStudents.length})
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={markAllPresent}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Check className="w-4 h-4" />
                      All Present
                    </button>
                    <button
                      onClick={markAllAbsent}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <X className="w-4 h-4" />
                      All Absent
                    </button>
                    <button
                      onClick={clearAll}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Student ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {student.student_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <select
                          value={attendance[student.id] || ''}
                          onChange={(e) => handleStatusChange(student.id, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          <option value="">-- Select --</option>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'Present')}
                            className={`p-2 rounded-lg transition-colors ${
                              attendance[student.id] === 'Present' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'Absent')}
                            className={`p-2 rounded-lg transition-colors ${
                              attendance[student.id] === 'Absent' 
                                ? 'bg-red-600 text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                            }`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="text-sm text-gray-600">
                  {stats.totalMarked} of {stats.totalStudents} students marked
                </div>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                  disabled={loading || stats.totalMarked === 0}
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Submitting...' : 'Submit Attendance'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {students.length === 0 && selectedCourse && selectedSemester && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Students Found</h3>
            <p className="text-gray-600">Click "Load Students" to fetch the student list for the selected course and semester.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;