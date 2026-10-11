import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Brain,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Lightbulb,
  Award,
  AlertTriangle,
  Activity,
  BookOpen,
  Clock,
  Users,
  Star,
  Calendar,
  Zap,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentPredict = () => {
  const navigate = useNavigate();
  // ✅ Parse student object from localStorage
  const storedStudent = JSON.parse(localStorage.getItem("student"));
  const loggedInStudentId = storedStudent?.id; // use ID from backend for API

  const [form, setForm] = useState({
    attendance: "",
    avg_test_score: "",
    project_score: "",
    assignment_score: "",
    study_hours: "",
    past_backlogs: "",
  });

  const [prediction, setPrediction] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStudent, setLoadingStudent] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/students/${loggedInStudentId}`);
        const s = res.data;
        setForm((prev) => ({
          ...prev,
          attendance: parseFloat(s.attendance) || 0,
          avg_test_score: parseFloat(s.avg_test_score) || 0,
        }));
      } catch (err) {
        setMessage("⚠️ Failed to load your academic data.");
        console.error(err);
      } finally {
        setLoadingStudent(false);
      }
    };

    if (loggedInStudentId) fetchStudentData();
  }, [loggedInStudentId]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const requiredFields = ["project_score", "assignment_score", "study_hours", "past_backlogs"];
    const missing = requiredFields.find((f) => !form[f]);

    if (missing) {
      setMessage("❗ Please complete all required fields.");
      return;
    }

    try {
      setIsLoading(true);

      // Add 3-second delay for AI analysis simulation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const payload = {
        student_id: loggedInStudentId,
        attendance: parseFloat(form.attendance),
        avg_test_score: parseFloat(form.avg_test_score),
        project_score: parseFloat(form.project_score),
        assignment_score: parseFloat(form.assignment_score),
        study_hours: parseFloat(form.study_hours),
        past_backlogs: parseInt(form.past_backlogs),
      };

      const res = await axios.post("http://localhost:4000/api/predict", payload);
      setPrediction(res.data.prediction);
      setMessage("🎯 Prediction completed successfully!");
    } catch (err) {
      console.error("Prediction error:", err);
      setMessage("❌ Prediction failed. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPredictionConfig = (pred) => {
    switch (pred) {
      case "Low":
        return {
          color: "from-red-500 to-red-600",
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          icon: <TrendingDown className="w-6 h-6" />,
          title: "Low Performance",
          description: "Your current inputs suggest room for improvement. Consider increasing study hours and focusing on assignments.",
          recommendations: [
            "Increase daily study hours",
            "Focus on completing assignments with higher scores",
            "Improve attendance consistency",
            "Seek help from instructors or peers"
          ]
        };
      case "High":
        return {
          color: "from-green-500 to-green-600",
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          borderColor: "border-green-200",
          icon: <TrendingUp className="w-6 h-6" />,
          title: "High Performance",
          description: "Excellent! Your academic trajectory looks very promising. Keep up the great work!",
          recommendations: [
            "Maintain current study routine",
            "Consider mentoring other students",
            "Explore advanced topics in your field",
            "Prepare for leadership opportunities"
          ]
        };
      case "Medium":
        return {
          color: "from-yellow-500 to-yellow-600",
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-200",
          icon: <Minus className="w-6 h-6" />,
          title: "Medium Performance",
          description: "You're on the right track! With some adjustments, you can achieve even better results.",
          recommendations: [
            "Optimize your study schedule",
            "Focus on improving project scores",
            "Maintain consistent attendance",
            "Set specific academic goals"
          ]
        };
      default:
        return {
          color: "from-gray-500 to-gray-600",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          icon: <BarChart3 className="w-6 h-6" />,
          title: "Performance Analysis",
          description: "Complete the form to get your personalized performance prediction.",
          recommendations: []
        };
    }
  };

  const inputFields = [
    {
      name: "project_score",
      label: "Project Score",
      icon: <Award className="w-4 h-4" />,
      placeholder: "Enter your project score (0-100)",
      type: "number",
      min: 0,
      max: 100,
      required: true,
      readonly: false
    },
    {
      name: "assignment_score",
      label: "Assignment Score",
      icon: <BookOpen className="w-4 h-4" />,
      placeholder: "Enter your assignment score (0-100)",
      type: "number",
      min: 0,
      max: 100,
      required: true,
      readonly: false
    },
    {
      name: "study_hours",
      label: "Study Hours/Day",
      icon: <Clock className="w-4 h-4" />,
      placeholder: "Hours spent studying daily",
      type: "number",
      min: 0,
      max: 24,
      step: 0.5,
      required: true,
      readonly: false
    },
    {
      name: "past_backlogs",
      label: "Past Backlogs",
      icon: <AlertTriangle className="w-4 h-4" />,
      placeholder: "Number of past backlogs",
      type: "number",
      min: 0,
      required: true,
      readonly: false
    }
  ];

  const readonlyFields = [
    {
      name: "attendance",
      label: "Attendance (%)",
      icon: <Calendar className="w-4 h-4" />,
      value: form.attendance
    },
    {
      name: "avg_test_score",
      label: "Avg Test Score",
      icon: <Star className="w-4 h-4" />,
      value: form.avg_test_score
    }
  ];

  if (loadingStudent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Brain className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
            <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 animate-ping"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Your Academic Data</h3>
          <p className="text-gray-600">Please wait while we fetch your information...</p>
        </div>
      </div>
    );
  }

  const predictionConfig = getPredictionConfig(prediction);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Performance Prediction</h1>
                <p className="text-gray-600 mt-1">Get personalized insights about your academic performance</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <Target className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Performance Prediction Form</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Readonly Fields */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <Info className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Current Academic Data</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {readonlyFields.map((field, index) => (
                      <div key={index} className="relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <div className="flex items-center space-x-2">
                            {field.icon}
                            <span>{field.label}</span>
                          </div>
                        </label>
                        <input
                          type="number"
                          value={field.value}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 font-medium focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {inputFields.map((field, index) => (
                    <div key={index} className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <div className="flex items-center space-x-2">
                          {field.icon}
                          <span>{field.label}</span>
                          {field.required && <span className="text-red-500">*</span>}
                        </div>
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>AI is analyzing your data...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Predict My Performance</span>
                    </>
                  )}
                </button>
              </form>

              {/* Message */}
              {message && (
                <div className={`mt-6 p-4 rounded-xl flex items-center space-x-3 ${
                  message.includes("failed") || message.includes("Please") 
                    ? "bg-red-50 text-red-700 border border-red-200" 
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}>
                  {message.includes("failed") || message.includes("Please") ? 
                    <XCircle className="w-5 h-5 flex-shrink-0" /> : 
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  }
                  <span className="font-medium">{message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Prediction Results */}
          <div className="space-y-6">
            {/* AI Analysis Loader */}
            {isLoading && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="text-center py-8">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                      <Brain className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 animate-ping"></div>
                    <div className="absolute inset-0 bg-indigo-600 rounded-full opacity-10 animate-ping" style={{animationDelay: '0.5s'}}></div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">AI Analysis in Progress</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Our advanced AI is analyzing your academic data patterns...
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Prediction Card */}
            {!isLoading && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <Activity className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Prediction Results</h3>
                </div>

                {prediction ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl ${predictionConfig.bgColor} border ${predictionConfig.borderColor}`}>
                      <div className="flex items-center justify-center mb-4">
                        <div className={`bg-gradient-to-r ${predictionConfig.color} p-3 rounded-full text-white shadow-lg`}>
                          {predictionConfig.icon}
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className={`text-lg font-bold ${predictionConfig.textColor} mb-2`}>
                          {predictionConfig.title}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {predictionConfig.description}
                        </p>
                      </div>
                    </div>

                    {/* Recommendations */}
                    {predictionConfig.recommendations.length > 0 && (
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center space-x-2 mb-3">
                          <Lightbulb className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-800">Recommendations</span>
                        </div>
                        <ul className="space-y-2">
                          {predictionConfig.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm text-blue-700">
                              <div className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready for Prediction</h4>
                    <p className="text-gray-600 text-sm">
                      Fill out the form to get your personalized performance prediction
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Info Card */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-6 h-6" />
                <h3 className="text-sm font-bold">AI-Powered Analysis</h3>
              </div>
              <p className="text-sm opacity-90 leading-relaxed">
                Our advanced machine learning model analyzes your academic patterns, 
                attendance records, and performance metrics to provide accurate predictions 
                and personalized recommendations for your success.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPredict;