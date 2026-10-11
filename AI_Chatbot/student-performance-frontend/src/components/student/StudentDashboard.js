import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  GraduationCap,
  LogOut,
  TrendingUp,
  Calendar,
  MessageCircle,
  BookOpen,
  Award,
  Clock,
  User,
  Mail,
  CreditCard,
  Bell,
  Settings,
  BarChart3,
  Target,
  ChevronRight,
  Activity,
  Users,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../Aibutton.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleClick = () => {
    navigate("/student-chat");
  };

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) {
      navigate("/student-login");
    } else {
      const studentId = JSON.parse(storedStudent).id;

      const fetchStudentData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/students/${studentId}`
          );
          setStudent(response.data);
        } catch (error) {
          console.error(error);
          setError("❌ Failed to load student data");
        } finally {
          setLoading(false);
        }
      };
      fetchStudentData();
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("student");
    navigate("/student-login");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  const quickStats = [
    {
      label: "Student ID",
      value: student.student_id,
      icon: Award,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Attendance",
      value: student.attendance + "%",
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Average Score",
      value: student.avg_test_score,
      icon: BookOpen,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Last Prediction",
      value: student.last_prediction,
      icon: GraduationCap,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  const dashboardCards = [
    {
      title: "Performance Analytics",
      description:
        "View detailed AI-powered academic predictions and performance insights",
      icon: BarChart3,
      color: "from-blue-500 to-blue-600",
      hoverColor: "from-blue-600 to-blue-700",
      path: "/student-performance",
      features: [
        "Grade Predictions",
        "Performance Trends",
        "Improvement Suggestions",
      ],
    },
    {
      title: "Attendance Tracking",
      description:
        "Monitor your attendance patterns and get insights for better consistency",
      icon: Clock,
      color: "from-emerald-500 to-emerald-600",
      hoverColor: "from-emerald-600 to-emerald-700",
      path: "/student-attendance",
      features: ["Daily Attendance", "Monthly Reports", "Attendance Alerts"],
    },
    {
      title: "AI Study Assistant",
      description:
        "Get personalized help with studies, assignments, and academic guidance",
      icon: MessageCircle,
      color: "from-purple-500 to-purple-600",
      hoverColor: "from-purple-600 to-purple-700",
      path: "/student-chat",
      features: ["24/7 AI Support", "Study Tips", "Assignment Help"],
    },
    {
      title: "Academic Resources",
      description:
        "Access study materials, schedules, and important academic information",
      icon: BookOpen,
      color: "from-orange-500 to-orange-600",
      hoverColor: "from-orange-600 to-orange-700",
      path: "/student-resources",
      features: ["Study Materials", "Class Schedules", "Academic Calendar"],
    },
  ];

  const recentActivities = [
    {
      icon: CheckCircle,
      text: "Completed Math Assignment",
      time: "2 hours ago",
      color: "text-green-500",
    },
    {
      icon: Calendar,
      text: "Attended Physics Lecture",
      time: "4 hours ago",
      color: "text-blue-500",
    },
    {
      icon: BookOpen,
      text: "Accessed Course Materials",
      time: "1 day ago",
      color: "text-purple-500",
    },
    {
      icon: MessageCircle,
      text: "Used AI Study Assistant",
      time: "2 days ago",
      color: "text-orange-500",
    },
  ];

  const upcomingEvents = [
    {
      title: "Chemistry Lab",
      time: "Tomorrow 10:00 AM",
      type: "Lab",
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Math Quiz",
      time: "Friday 2:00 PM",
      type: "Assessment",
      color: "bg-red-100 text-red-800",
    },
    {
      title: "Project Submission",
      time: "Next Monday",
      type: "Deadline",
      color: "bg-orange-100 text-orange-800",
    },
  ];

  return (
    // Your JSX code...
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Student Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {student.first_name}!
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm text-gray-600">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <Settings className="w-5 h-5" />
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {student.first_name} {student.last_name}
                </h2>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-1" />
                    {student.student_id}
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {student.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <div className="flex space-x-6">
                {quickStats.map((stat, index) => (
                  <div
                    key={index}
                    className={`text-center p-3 rounded-lg ${stat.bg}`}
                  >
                    <stat.icon
                      className={`w-5 h-5 ${stat.color} mx-auto mb-1`}
                    />
                    <p className="text-xs text-gray-600">{stat.label}</p>
                    <p className="font-semibold text-gray-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {dashboardCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group cursor-pointer"
                  onClick={() => handleNavigation(card.path)}
                >
                  <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-full bg-gradient-to-r ${card.color} shadow-lg`}
                      >
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {card.description}
                    </p>

                    <div className="space-y-1">
                      {card.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-xs text-gray-500"
                        >
                          <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Activities
                </h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.text}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleNavigation("/student-chat")}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium">Ask AI Assistant</span>
                </button>
                <button
                  onClick={() => handleNavigation("/student-performance")}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">View Performance</span>
                </button>
                <button
                  onClick={() => handleNavigation("/student-attendance")}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Check Attendance</span>
                </button>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Upcoming Events
              </h3>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {event.title}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${event.color}`}
                      >
                        {event.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{event.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                This Week's Goal
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Attendance Target</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </div>
                <p className="text-xs opacity-80">
                  You're 3% away from your goal!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
      >
        <div className="relative w-10 h-10">
          {/* Floating particles container */}
          <div className="particle-container">
            {Array.from({ length: 6 }).map((_, i) => (
              <span className={`particle particle-${i}`} key={i}></span>
            ))}
          </div>

          {/* Icon */}
          <div className="relative z-10 w-10 h-10 bg-white text-purple-600 rounded-full flex items-center justify-center">
            <Sparkles size={22} />
          </div>
        </div>
        <span className="font-semibold">Try AI</span>
      </div>
    </div>
  );
};

export default StudentDashboard;
