import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Users, UserPlus, Eye, Calendar, BookOpen, GraduationCap, FileText, BarChart3, LogOut, Home } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import "./Aibutton.css";

const Sidebar = () => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (key) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/view-students");
  };

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: Home 
    },
    {
      name: 'Student Management',
      icon: Users,
      isDropdown: true,
      key: 'students',
      children: [
        { name: 'Add Students', path: '/add-student', icon: UserPlus },
        { name: 'View Students', path: '/view-students', icon: Eye },
      ]
    },
    {
      name: 'Attendance',
      icon: Calendar,
      isDropdown: true,
      key: 'attendance',
      children: [
        { name: 'Mark Attendance', path: '/attendance', icon: Calendar },
        { name: 'View Attendance', path: '/view-attendance', icon: Eye },
      ]
    },
    {
      name: 'Academic Management',
      icon: BookOpen,
      isDropdown: true,
      key: 'academic',
      children: [
        { name: 'Manage Courses', path: '/courses', icon: BookOpen },
        { name: 'Manage Semesters', path: '/semesters', icon: Calendar },
        { name: 'Manage Subjects', path: '/subjects', icon: FileText },
      ]
    },
    { 
      name: 'Marks & Grades', 
      path: '/marks', 
      icon: BarChart3 
    },
    { 
      name: 'Logout', 
      path: '/logout', 
      icon: LogOut,
      isLogout: true
    }
  ];

  const isActiveDropdown = (children) => {
    return children.some(child => location.pathname === child.path);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-72 min-h-screen fixed bg-gradient-to-b from-blue-800 to-blue-900 text-white shadow-2xl">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-75"></div>
        <div className="relative text-center py-8 px-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-blue-700" />
          </div>
          <h1 className="text-2xl font-bold mb-1">EduConnect AI</h1>
          <p className="text-blue-200 text-sm">Academic Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col p-4 gap-1">
        {navItems.map((item) => (
          <div key={item.key || item.path} className="relative">
            {item.isDropdown ? (
              <div>
                {/* Dropdown Header */}
                <button
                  onClick={() => toggleDropdown(item.key)}
                  className={`w-full flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-200 group ${
                    isActiveDropdown(item.children) 
                      ? 'bg-blue-600 shadow-lg' 
                      : 'hover:bg-blue-700 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {openDropdowns[item.key] ? (
                    <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                  )}
                </button>

                {/* Dropdown Content */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  openDropdowns[item.key] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="pl-4 pr-2 py-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`flex items-center gap-3 py-2 px-4 rounded-lg transition-all duration-200 group ${
                          isActivePath(child.path)
                            ? 'bg-blue-500 shadow-md transform scale-105' 
                            : 'hover:bg-blue-600 hover:shadow-sm hover:translate-x-1'
                        }`}
                      >
                        <child.icon className="w-4 h-4 opacity-75" />
                        <span className="text-sm font-medium">{child.name}</span>
                        {isActivePath(child.path) && (
                          <div className="w-2 h-2 bg-white rounded-full ml-auto animate-pulse"></div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Regular Navigation Item */
              <Link
                to={item.path}
                className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 group ${
                  isActivePath(item.path)
                    ? 'bg-blue-600 shadow-lg transform scale-105' 
                    : item.isLogout 
                      ? 'hover:bg-red-600 hover:shadow-md' 
                      : 'hover:bg-blue-700 hover:shadow-md'
                } ${item.isLogout ? 'mt-4 border-t border-blue-600 pt-6' : ''}`}
              >
                <item.icon className={`w-5 h-5 ${item.isLogout ? 'text-red-300' : ''}`} />
                <span className={`font-medium ${item.isLogout ? 'text-red-200' : ''}`}>
                  {item.name}
                </span>
                {isActivePath(item.path) && !item.isLogout && (
                  <div className="w-2 h-2 bg-white rounded-full ml-auto animate-pulse"></div>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-blue-900 bg-opacity-50">
        <div className="text-center text-xs text-blue-200">
          <p>© 2025 Academic System</p>
          <p className="mt-1 opacity-75">v2.1.0</p>
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

export default Sidebar;