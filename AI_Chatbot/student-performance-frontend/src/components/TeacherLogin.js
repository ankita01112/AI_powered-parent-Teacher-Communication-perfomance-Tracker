import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Mail, BookOpen, GraduationCap } from 'lucide-react';

const TeacherLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setMsg('');
    setIsLoading(true);

    try {
      const res = await axios.post('https://student-performance-api-ankita.onrender.com/api/teachers/login', { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('teacherName', res.data.teacher.name);

      setMsg('✅ Login successful!');
      navigate('/dashboard');
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.error || 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-300">Sign in to your teacher account</p>
        </div>

        <div className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full pl-10 pr-12 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              )}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors">
                Create Account
              </a>
            </p>

            <button onClick={() => navigate('/')} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Back
              </button>
          </div>

          {/* Message Display */}
          {msg && (
            <div className={`text-center text-sm mt-4 p-3 rounded-lg ${
              msg.includes('✅') 
                ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                : 'bg-red-500/20 text-red-300 border border-red-400/30'
            }`}>
              {msg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-400 text-xs">
            <BookOpen className="w-4 h-4" />
            <span>EduPortal Teacher Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;