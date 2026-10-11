import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Bell, 
  Brain, 
  Heart, 
  TrendingUp, 
  Smartphone, 
  Users, 
  BookOpen, 
  CheckCircle, 
  ArrowRight, 
  Play,
  Star,
  MessageCircle,
  BarChart3,
  Shield,
  Zap,
  Target,
  Award,
  Clock,
  Eye,
  Image,
  Monitor,
  Camera,
  UserCheck,
  BookOpenCheck,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Analytics",
      description: "Smart insights into your child's learning patterns and emotional well-being",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Real-Time Alerts",
      description: "Instant notifications for attendance, grades, and behavioral changes",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Smart Chatbot",
      description: "24/7 AI assistant for instant answers about your child's progress",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Emotional Intelligence",
      description: "Early detection of stress and emotional challenges using NLP",
      color: "from-red-500 to-orange-600"
    }
  ];

  const stats = [
    { number: "95%", label: "Parent Satisfaction", icon: <Star className="w-6 h-6" /> },
    { number: "40%", label: "Faster Communication", icon: <Clock className="w-6 h-6" /> },
    { number: "85%", label: "Early Issue Detection", icon: <Eye className="w-6 h-6" /> },
    { number: "24/7", label: "AI Support", icon: <Shield className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Parent of 2",
      content: "Finally, I can stay connected with my children's education without the constant back-and-forth emails. The AI insights are incredibly helpful!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Teacher",
      content: "This platform has transformed how I communicate with parents. The automated reports save me hours each week.",
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "School Principal",
      content: "The emotional intelligence features have helped us identify at-risk students early. It's a game-changer for student well-being.",
      rating: 5
    }
  ];

  const StarRating = ({ rating }) => {
    const stars = Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-500'}`}
      />
    ));
    return <div className="flex space-x-1">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/10 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                EduConnect AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
              <a href="/student-login" className="text-gray-300 hover:text-white transition-colors">Parent</a>
              <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
                Staff Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center bg-gradient-to-r from-blue-500/20 to-purple-600/20 px-4 py-2 rounded-full border border-blue-500/30 mb-8">
                <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                <span className="text-sm font-medium">Revolutionary AI-Powered Education Platform</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                Bridge the Gap Between
                <br />
                <span className="text-white">Parents & Teachers</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                The first AI-powered platform that provides real-time insights, emotional intelligence, 
                and seamless communication for your child's educational journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 hover:shadow-2xl flex items-center justify-center">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="group flex items-center text-white hover:text-blue-400 transition-colors justify-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-white/20 transition-all">
                    <Play className="w-5 h-5 ml-1" />
                  </div>
                  <span className="font-medium">Watch Demo</span>
                </button>
              </div>
            </div>
            
            {/* Hero Image Placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl p-8 border border-blue-500/30 backdrop-blur-sm">
                {/* Mockup Device */}
                <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">AI Analysis Complete</div>
                        <div className="text-gray-400 text-sm">Your child's progress report is ready</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span className="text-white font-medium">Performance Trending Up</span>
                      </div>
                      <div className="text-gray-300 text-sm">Math scores improved by 15% this week</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-pink-500/30 to-orange-500/30 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-full blur-xl animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-transform">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full mb-4 border border-blue-500/30">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Visual Elements */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover how our AI-powered platform transforms parent-teacher communication
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:scale-105 cursor-pointer ${
                  activeFeature === index 
                    ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/50' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 bg-gradient-to-br ${feature.color}`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
                
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              See It In Action
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the intuitive dashboard that brings all your child's information together
            </p>
          </div>
          
          {/* Dashboard Mockup */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-8 border border-slate-700/50 backdrop-blur-sm">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Panel - Student Info */}
              <div className="bg-slate-800/70 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Emma Johnson</h3>
                    <p className="text-gray-400 text-sm">Grade 8A</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Attendance</span>
                    <span className="text-green-400 font-semibold">96%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Overall Grade</span>
                    <span className="text-blue-400 font-semibold">A-</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Mood Today</span>
                    <span className="text-yellow-400 font-semibold">😊 Happy</span>
                  </div>
                </div>
              </div>
              
              {/* Middle Panel - Performance Chart */}
              <div className="bg-slate-800/70 rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <h3 className="text-white font-semibold">Performance Trends</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300 text-sm">Mathematics</span>
                      <span className="text-green-400 text-sm">+15%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300 text-sm">Science</span>
                      <span className="text-blue-400 text-sm">+8%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '78%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300 text-sm">English</span>
                      <span className="text-purple-400 text-sm">+12%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '92%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Panel - Alerts */}
              <div className="bg-slate-800/70 rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Bell className="w-5 h-5 text-orange-400" />
                  <h3 className="text-white font-semibold">Recent Alerts</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-sm font-medium">Improvement Alert</span>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">Math quiz score: 95%</p>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-blue-400 text-sm font-medium">Assignment Due</span>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">Science project tomorrow</p>
                  </div>
                  
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-purple-400 text-sm font-medium">Behavior Note</span>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">Excellent teamwork today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                The Problems We Solve
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Target className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Limited Parent-Teacher Communication</h3>
                    <p className="text-gray-400">Traditional systems focus on grades, not real-time insights and emotional well-being</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Target className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Missing Emotional Intelligence</h3>
                    <p className="text-gray-400">No early detection of stress, disengagement, or behavioral changes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Target className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Delayed Interventions</h3>
                    <p className="text-gray-400">Parents discover issues too late, missing critical intervention opportunities</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Our AI-Powered Solutions
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Real-Time AI Insights</h3>
                    <p className="text-gray-400">Personalized performance reports and instant alerts for comprehensive monitoring</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Emotional & Behavioral Analytics</h3>
                    <p className="text-gray-400">NLP-powered sentiment analysis for early stress and challenge detection</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">24/7 AI Chatbot Support</h3>
                    <p className="text-gray-400">Instant responses to parent queries with voice and text-based interactions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Simple steps to transform your child's educational experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserCheck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">1. Quick Setup</h3>
              <p className="text-gray-400 mb-6">Create your account and connect with your child's school in minutes</p>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-300">✓ Secure registration</div>
                <div className="text-sm text-gray-300">✓ School integration</div>
                <div className="text-sm text-gray-300">✓ Privacy protection</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">2. AI Analysis</h3>
              <p className="text-gray-400 mb-6">Our AI continuously monitors and analyzes your child's progress</p>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-300">✓ Real-time monitoring</div>
                <div className="text-sm text-gray-300">✓ Behavioral analysis</div>
                <div className="text-sm text-gray-300">✓ Predictive insights</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">3. Actionable Insights</h3>
              <p className="text-gray-400 mb-6">Receive personalized recommendations and timely interventions</p>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-300">✓ Smart alerts</div>
                <div className="text-sm text-gray-300">✓ Progress reports</div>
                <div className="text-sm text-gray-300">✓ Improvement tips</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of parents and teachers who've transformed their communication
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-8 transform hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>
                <p className="text-lg text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                    {/* Replace with your image */}
                    {/* <img src={`/images/user${index + 1}.png`} alt={testimonial.name} className="w-full h-full object-cover rounded-full" /> */}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- New Call to Action Section --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl p-8 md:p-16 border border-blue-500/30">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Ready to Transform Education?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join EduConnect AI today and take the first step towards a smarter, more connected learning experience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="group bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- New Footer Section --- */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-black/10 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                EduConnect AI
              </span>
            </div>
            <div className="flex flex-wrap justify-center space-x-6 md:space-x-8">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a>
              <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} EduConnect AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;