import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Calendar, 
  Clock, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Users,
  CalendarDays,
  BarChart3,
  ArrowLeft,
  Activity,
  Target,
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentAttendance = () => {
  const navigate = useNavigate();
  const student = JSON.parse(localStorage.getItem("student")); // from login
  const studentId = student?.id;

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(`https://student-performance-api-ankita.onrender.com/api/attendance/student/${studentId}`);
        setAttendance(res.data);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to load attendance");
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchAttendance();
  }, [studentId]);

  // Calculate attendance statistics
  const getAttendanceStats = () => {
    if (attendance.length === 0) return { present: 0, absent: 0, percentage: 0, total: 0 };
    
    const present = attendance.filter(record => record.status === "Present").length;
    const absent = attendance.filter(record => record.status === "Absent").length;
    const total = attendance.length;
    const percentage = Math.round((present / total) * 100);

    return { present, absent, percentage, total };
  };

  const stats = getAttendanceStats();

  // Get status color and icon
  const getStatusDisplay = (status) => {
    if (status === "Present") {
      return {
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: <CheckCircle className="w-4 h-4" />
      };
    } else {
      return {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: <XCircle className="w-4 h-4" />
      };
    }
  };

  // Get attendance percentage color
  const getPercentageColor = (percentage) => {
    if (percentage >= 85) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getPercentageGradient = (percentage) => {
    if (percentage >= 85) return "from-green-500 to-green-600";
    if (percentage >= 75) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
            <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 animate-ping"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Attendance Records</h3>
          <p className="text-gray-600">Please wait while we fetch your attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/student-dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Attendance History</h1>
                <p className="text-gray-600 mt-1">Track your attendance records and performance</p>
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center space-x-3 border border-red-200">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        ) : attendance.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Attendance Records</h3>
              <p className="text-gray-600">Your attendance records will appear here once they're available.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Overall Percentage */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-r ${getPercentageGradient(stats.percentage)} p-3 rounded-full`}>
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-2xl font-bold ${getPercentageColor(stats.percentage)}`}>
                    {stats.percentage}%
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Overall Attendance</h3>
                <p className="text-sm text-gray-600">Your attendance percentage</p>
              </div>

              {/* Total Days */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-full">
                    <CalendarDays className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Days</h3>
                <p className="text-sm text-gray-600">Total recorded days</p>
              </div>

              {/* Present Days */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-full">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats.present}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Present Days</h3>
                <p className="text-sm text-gray-600">Days you attended</p>
              </div>

              {/* Absent Days */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-full">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-red-600">{stats.absent}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Absent Days</h3>
                <p className="text-sm text-gray-600">Days you missed</p>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Activity className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Detailed Attendance Records</h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <CalendarDays className="w-4 h-4" />
                          <span>Date</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4" />
                          <span>Status</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendance.map((record, index) => {
                      const statusDisplay = getStatusDisplay(record.status);
                      return (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                              <span className="text-sm font-medium text-gray-900">{index + 1}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {new Date(record.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.bgColor} ${statusDisplay.borderColor} ${statusDisplay.color} border`}>
                              {statusDisplay.icon}
                              <span>{record.status}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="w-6 h-6" />
                <h3 className="text-lg font-bold">Performance Insights</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Attendance Status</h4>
                  <p className="text-sm opacity-90">
                    {stats.percentage >= 85 
                      ? "Excellent attendance! Keep up the great work." 
                      : stats.percentage >= 75 
                      ? "Good attendance, but there's room for improvement." 
                      : "Your attendance needs attention. Consider improving consistency."}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recommendation</h4>
                  <p className="text-sm opacity-90">
                    {stats.percentage >= 85 
                      ? "Maintain your current attendance pattern for optimal academic performance." 
                      : "Regular attendance is key to academic success. Try to improve your consistency."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;