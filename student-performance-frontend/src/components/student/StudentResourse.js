import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  ArrowLeft, 
  Clock, 
  Users, 
  FileText,
  Video,
  Download,
  Search,
  Star,
  Sparkles,
  Calendar,
  Bell,
  CheckCircle,
  Rocket,
  Construction
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentResourcesComingSoon = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set launch date (adjust as needed)
  const launchDate = new Date('2024-12-01T00:00:00').getTime();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      } else {
        clearInterval(timer);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  const upcomingFeatures = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Study Materials",
      description: "Access textbooks, PDFs, and study guides for all your courses",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Video Lectures",
      description: "Watch recorded lectures and educational videos anytime",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Past Papers",
      description: "Practice with previous exam papers and sample questions",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Resource Downloads",
      description: "Download important documents and reference materials",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Search",
      description: "Quickly find any resource with our advanced search feature",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Favorites",
      description: "Save and organize your most-used resources",
      color: "from-pink-500 to-pink-600"
    }
  ];

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
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Resources</h1>
                <p className="text-gray-600 mt-1">Your academic materials and study tools</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Hero */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <div className="relative inline-block">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-full mb-6">
                  <Construction className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-full animate-pulse">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Coming Soon!
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                We're working hard to bring you an amazing resource center with everything you need for academic success.
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Days', value: countdown.days },
                { label: 'Hours', value: countdown.hours },
                { label: 'Minutes', value: countdown.minutes },
                { label: 'Seconds', value: countdown.seconds }
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
                  <div className="text-2xl md:text-3xl font-bold">{item.value.toString().padStart(2, '0')}</div>
                  <div className="text-sm text-blue-100">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <Rocket className="w-5 h-5" />
              <span className="font-semibold">Launch Date: December 1st, 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResourcesComingSoon;