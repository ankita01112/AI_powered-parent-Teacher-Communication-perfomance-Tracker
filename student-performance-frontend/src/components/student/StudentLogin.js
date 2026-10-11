import React, { useState } from 'react';
import axios from 'axios';
import {
  User, // new icon for identifier
  Calendar,
  LogIn,
  GraduationCap,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const StudentLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [dob, setDob] = useState('');
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setMsg('');
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:4000/api/student-auth/login', { 
        identifier, 
        dob 
      });

      localStorage.setItem('student', JSON.stringify(res.data.student));
      setMsg('Login successful!');

      setTimeout(() => {
        window.location.href = '/student-dashboard';
      }, 800);
      
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        setMsg(err.response.data?.error || 'Invalid credentials');
      } else if (err.request) {
        setMsg('Unable to connect to server. Please try again.');
      } else {
        setMsg('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your student account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            {/* Identifier Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Student ID or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="ANGT-001 or name@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Date of Birth Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date of Birth
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading || !identifier || !dob}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </div>

          {/* Message Display */}
          {msg && (
            <div className={`mt-6 p-4 rounded-lg border flex items-center gap-3 animate-fadeIn ${
              msg.includes('successful')
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {msg.includes('successful') ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium">{msg}</span>
            </div>
          )}

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex items-center justify-center gap-4 text-sm">
              <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Back
              </button>
              <span className="text-gray-300">|</span>
              <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Contact Support
              </button>
            </div>
            <div className="text-xs text-gray-500">
              Protected by advanced security measures
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Contact your institution
            </button>
          </p>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default StudentLogin;
