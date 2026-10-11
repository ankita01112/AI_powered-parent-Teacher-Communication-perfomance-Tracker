import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Award, 
  AlertTriangle, 
  BookOpen, 
  Clock,
  GraduationCap,
  BarChart3,
  Bell,
  RefreshCw,
  Eye,
  ChevronRight,
  UserX,
  CheckCircle,
  XCircle,
  Target,
  Activity,
  PieChart
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell 
} from 'recharts';


const TeacherDashboard = () => {
  const [teacherName, setTeacherName] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('teacherName');

    if (!token) {
      console.log('No token found, redirect to login');
      return;
    }

    setTeacherName(name || 'Teacher');
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    
    try {
      await Promise.all([
        fetchStudents(),
        fetchAttendance(),
        fetchCourses(),
        fetchSubjects()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('https://student-performance-api-ankita.onrender.com/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setStudents([]);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await fetch('https://student-performance-api-ankita.onrender.com/api/attendance');
      if (!response.ok) throw new Error('Failed to fetch attendance');
      const data = await response.json();
      setAttendance(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
      setAttendance([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('https://student-performance-api-ankita.onrender.com/api/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setCourses([]);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch('https://student-performance-api-ankita.onrender.com/api/subjects');
      if (!response.ok) throw new Error('Failed to fetch subjects');
      const data = await response.json();
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
      setSubjects([]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('teacherName');
    console.log('Logout successful');
  };

  // Calculate statistics
  const totalStudents = students.length;
  const totalCourses = courses.length;
  const totalSubjects = subjects.length;
  
  const lowPrediction = students.filter((s) => s.last_prediction === 'Low').length;
  const mediumPrediction = students.filter((s) => s.last_prediction === 'Medium').length;
  const highPrediction = students.filter((s) => s.last_prediction === 'High').length;

  const avgAttendance = students.length > 0
    ? (students.reduce((sum, s) => sum + (parseFloat(s.attendance) || 0), 0) / students.length).toFixed(1)
    : 0;

  const atRiskStudents = students.filter(s => 
    s.last_prediction === 'Low' || parseFloat(s.attendance) < 70
  );

  // Analytics data processing
  const attendanceOverTime = attendance.slice(-30).reduce((acc, record) => {
    const date = new Date(record.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date, present: 0, absent: 0, total: 0 };
    }
    acc[date].total++;
    if (record.status === 'Present') {
      acc[date].present++;
    } else {
      acc[date].absent++;
    }
    return acc;
  }, {});

  const attendanceChartData = Object.values(attendanceOverTime).map(day => ({
    ...day,
    percentage: ((day.present / day.total) * 100).toFixed(1)
  }));

  const performanceData = [
    { name: 'High Performance', value: highPrediction, color: '#10B981' },
    { name: 'Medium Performance', value: mediumPrediction, color: '#F59E0B' },
    { name: 'Low Performance', value: lowPrediction, color: '#EF4444' }
  ];

  const subjectWiseData = subjects.map(subject => ({
    subject: subject.name || subject.subject_name || 'Unknown',
    students: students.filter(s => s.subject_id === subject.id).length,
    avgScore: Math.floor(Math.random() * 40) + 60 // Mock data for demonstration
  }));

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${color} mt-1`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center mt-2 text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(trend)}% from last week
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-6 ml-72">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {teacherName}! 👋
            </h1>
            <p className="text-gray-600">Here's your academic analytics and insights.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
              {atRiskStudents.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {atRiskStudents.length}
                </span>
              )}
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={totalStudents}
            subtitle="Active enrollments"
            icon={Users}
            color="text-blue-600"
            bgColor="bg-white"
            trend={5}
          />
          <StatCard
            title="Average Attendance"
            value={`${avgAttendance}%`}
            subtitle="Class participation"
            icon={Calendar}
            color="text-green-600"
            bgColor="bg-white"
            trend={-2}
          />
          <StatCard
            title="At Risk Students"
            value={atRiskStudents.length}
            subtitle="Need attention"
            icon={AlertTriangle}
            color="text-red-600"
            bgColor="bg-white"
            trend={-10}
          />
          <StatCard
            title="Active Subjects"
            value={totalSubjects}
            subtitle={`${totalSubjects} subjects Total`}
            icon={BookOpen}
            color="text-purple-600"
            bgColor="bg-white"
            
          />
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attendance Trend */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trend (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="percentage" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Performance Predictions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {performanceData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                  <p className="text-xs text-gray-600">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subject-wise Analytics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject-wise Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectWiseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#3B82F6" name="Students" />
              <Bar dataKey="avgScore" fill="#10B981" name="Avg Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* At Risk Students */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Students Need Attention</h3>
              <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                {atRiskStudents.length} students
              </span>
            </div>
            <div className="space-y-3">
              {atRiskStudents.length > 0 ? (
                atRiskStudents.slice(0, 5).map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <UserX className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">
                          {student.attendance}% attendance • {student.last_prediction} prediction
                        </p>
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-600">All students are performing well!</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
              <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                {highPrediction} students
              </span>
            </div>
            <div className="space-y-3">
              {students.filter(s => s.last_prediction === 'High').slice(0, 5).map((student, index) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">
                        {student.attendance}% attendance • High performance
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;