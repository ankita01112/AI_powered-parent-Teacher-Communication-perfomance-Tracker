import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, User, Mail, Phone, Lock, BookOpen, GraduationCap, UserPlus } from 'lucide-react';

const TeacherSignup = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', subject: ''
  });
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    setMsg('');
    setIsLoading(true);

    try {
      const res = await axios.post('https://student-performance-api-ankita.onrender.com/api/teachers/signup', form);
      setMsg('✅ Signup successful!');
      
      // Optional: Reset form on success
      setForm({
        name: '', email: '', phone: '', password: '', subject: ''
      });
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.error || 'Signup failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-full">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Join EduPortal</h2>
          <p className="text-gray-300">Create your teacher account</p>
        </div>

        <div className="space-y-5">
          {/* Name Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              required
              className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              required
              className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
            />
          </div>

          {/* Phone Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              required
              className="w-full pl-10 pr-12 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
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

          {/* Subject Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject (e.g., Mathematics, English)"
              value={form.subject}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-300 text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors">
                Sign In
              </a>
            </p>
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
            <GraduationCap className="w-4 h-4" />
            <span>EduPortal Teacher Registration</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignup;