import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Search,
  Download,
  RefreshCw,
  AlertCircle,
  User,
  GraduationCap,
  Clock
} from 'lucide-react';
import Sidebar from './Sidebar';

const AttendanceView = () => {
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    course_id: '',
    semester_id: '',
    student_id: '',
    status: '',
    from_date: '',
    to_date: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (filters.course_id) {
      fetchSemesters(filters.course_id);
    } else {
      setSemesters([]);
      setFilters(prev => ({ ...prev, semester_id: '', student_id: '' }));
    }
  }, [filters.course_id]);

  useEffect(() => {
    if (filters.course_id && filters.semester_id) {
      fetchStudents(filters.course_id, filters.semester_id);
    } else {
      setStudents([]);
      setFilters(prev => ({ ...prev, student_id: '' }));
    }
  }, [filters.semester_id]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://student-performance-api-ankita.onrender.com/api/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
      setError('');
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchSemesters = async (courseId) => {
    try {
      const res = await axios.get(`https://student-performance-api-ankita.onrender.com/api/semesters?course_id=${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSemesters(res.data);
    } catch (err) {
      console.error('Failed to load semesters:', err);
      setError('Failed to load semesters');
    }
  };

  const fetchStudents = async (courseId, semesterId) => {
    try {
      const res = await axios.get(`https://student-performance-api-ankita.onrender.com/api/students?course_id=${courseId}&semester_id=${semesterId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to load students:', err);
      setError('Failed to load students');
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('https://student-performance-api-ankita.onrender.com/api/attendance', {
        headers: { Authorization: `Bearer ${token}` },
      });

      let filtered = res.data;

      if (filters.course_id) {
        filtered = filtered.filter(r => r.course_id === parseInt(filters.course_id));
      }
      if (filters.semester_id) {
        filtered = filtered.filter(r => r.semester_id === parseInt(filters.semester_id));
      }
      if (filters.student_id) {
        filtered = filtered.filter(r => r.student_id === parseInt(filters.student_id));
      }
      if (filters.status) {
        filtered = filtered.filter(r => r.status === filters.status);
      }
      if (filters.from_date) {
        filtered = filtered.filter(r => new Date(r.date) >= new Date(filters.from_date));
      }
      if (filters.to_date) {
        filtered = filtered.filter(r => new Date(r.date) <= new Date(filters.to_date));
      }

      setRecords(filtered);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
      setError('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      course_id: '',
      semester_id: '',
      student_id: '',
      status: '',
      from_date: '',
      to_date: '',
    });
    setRecords([]);
  };

  const exportData = () => {
    // Simple CSV export functionality
    const csvContent = [
      ['Student Name', 'Date', 'Status'],
      ...records.map(rec => [
        `${rec.first_name} ${rec.last_name}`,
        new Date(rec.date).toLocaleDateString(),
        rec.status
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_records.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    return status === 'Present' ? 
      <CheckCircle className="w-4 h-4 text-green-600" /> : 
      <XCircle className="w-4 h-4 text-red-600" />;
  };

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
            <h1 className="text-3xl font-bold text-gray-800">Attendance Records</h1>
          </div>
          <p className="text-gray-600">View and filter student attendance records</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Filters Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filter Records</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Course Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <GraduationCap className="w-4 h-4" />
                Course
              </label>
              <select 
                name="course_id" 
                value={filters.course_id} 
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select Course</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.course_name}</option>
                ))}
              </select>
            </div>

            {/* Semester Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <BookOpen className="w-4 h-4" />
                Semester
              </label>
              <select 
                name="semester_id" 
                value={filters.semester_id} 
                onChange={handleChange}
                disabled={!filters.course_id}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Semester</option>
                {semesters.map(s => (
                  <option key={s.id} value={s.id}>Semester {s.semester_number}</option>
                ))}
              </select>
            </div>

            {/* Student Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="w-4 h-4" />
                Student
              </label>
              <select 
                name="student_id" 
                value={filters.student_id} 
                onChange={handleChange}
                disabled={!filters.semester_id}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
                ))}
              </select>
            </div>

            {/* Status Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4" />
                Status
              </label>
              <select 
                name="status" 
                value={filters.status} 
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                From Date
              </label>
              <input 
                type="date" 
                name="from_date" 
                value={filters.from_date} 
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                To Date
              </label>
              <input 
                type="date" 
                name="to_date" 
                value={filters.to_date} 
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchAttendance}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? 'Loading...' : 'Search Records'}
            </button>

            <button
              onClick={clearFilters}
              className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Clear Filters
            </button>

            {records.length > 0 && (
              <button
                onClick={exportData}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            )}
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Attendance Records</h2>
              <div className="text-sm text-gray-600">
                {records.length} record{records.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500 text-lg">No attendance records found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your filters or search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  records.map((rec, index) => (
                    <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {rec.first_name} {rec.last_name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(rec.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(rec.status)}
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            rec.status === 'Present' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {rec.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;