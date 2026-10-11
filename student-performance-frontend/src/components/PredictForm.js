import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from './Sidebar';
import { useLocation } from "react-router-dom";
import {
  Users,
  Target,
  Calendar,
  Award,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  Loader2,
  BarChart3,
  FileText,
  AlertCircle
} from "lucide-react";

const PredictStudent = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
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
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const studentIdFromQuery = urlParams.get("student_id");

  // Load students on mount and pre-fill if studentId is in query params
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setIsLoadingStudents(true);
        const token = localStorage.getItem('token'); // Ensure token is available for API calls
        const res = await axios.get("http://localhost:4000/api/students", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(res.data);

        // Auto-select student from URL (if present)
        if (studentIdFromQuery) {
          setSelectedStudentId(studentIdFromQuery);
          const selected = res.data.find((s) => String(s.id) === String(studentIdFromQuery));
          if (selected) {
            // Set initial auto-filled fields
            setForm((prev) => ({
              ...prev,
              attendance: selected.attendance || 0,
              avg_test_score: selected.avg_test_score || 0,
            }));
            // Fetch and set project/assignment scores for the pre-selected student
            fetchStudentScores(studentIdFromQuery);
          }
        }
      } catch (err) {
        console.error("Failed to load students:", err);
        setMessage("Failed to load students. Please check your connection.");
      } finally {
        setIsLoadingStudents(false);
      }
    };

    loadStudents();
  }, [studentIdFromQuery]); // Depend on studentIdFromQuery to re-run if it changes

  // Function to fetch student-specific scores
  const fetchStudentScores = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/api/scores/student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const scoreData = res.data; // This will be {} if no scores exist
      setForm((prev) => ({
        ...prev,
        project_score: scoreData.project_score || "", // Use empty string if null/undefined
        assignment_score: scoreData.assignment_score || "", // Use empty string if null/undefined
      }));
    } catch (err) {
      console.error("Failed to load student scores:", err);
      setMessage("Failed to load student scores. Please try again.");
      setForm((prev) => ({
        ...prev,
        project_score: "",
        assignment_score: "",
      }));
    }
  };

  // Handle dropdown selection
  const handleStudentChange = (e) => {
    const id = e.target.value;
    setSelectedStudentId(id);
    setMessage(""); // Clear messages on student change
    setPrediction(""); // Clear prediction on student change

    const selected = students.find((s) => String(s.id) === String(id));
    if (selected) {
      setForm((prev) => ({
        ...prev,
        attendance: selected.attendance || 0,
        avg_test_score: selected.avg_test_score || 0,
        // Reset project/assignment scores when a new student is selected
        project_score: "",
        assignment_score: "",
      }));
      // Fetch project and assignment scores for the newly selected student
      fetchStudentScores(id);
    } else {
      // Clear form fields if no student is selected
      setForm({
        attendance: "",
        avg_test_score: "",
        project_score: "",
        assignment_score: "",
        study_hours: "",
        past_backlogs: "",
      });
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudentId) {
      setMessage("Please select a student.");
      return;
    }

    // Validate required fields for prediction (manual inputs)
    if (
      form.project_score === "" || // Check for empty string
      form.assignment_score === "" || // Check for empty string
      !form.study_hours ||
      !form.past_backlogs
    ) {
      setMessage("Please ensure all prediction factors (Project Score, Assignment Score, Study Hours, Past Backlogs) are filled.");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");
      setPrediction("");

      const payload = {
        student_id: selectedStudentId,
        attendance: parseFloat(form.attendance) || 0,
        avg_test_score: parseFloat(form.avg_test_score) || 0,
        project_score: parseFloat(form.project_score),
        assignment_score: parseFloat(form.assignment_score),
        study_hours: parseFloat(form.study_hours),
        past_backlogs: parseInt(form.past_backlogs),
      };

      console.log("Sending prediction request:", payload);

      // 3-second delay to show AI prediction loading
      await new Promise(resolve => setTimeout(resolve, 3000));

      const token = localStorage.getItem('token');
      const res = await axios.post("http://localhost:4000/api/predict", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Prediction response:", res.data);

      setPrediction(res.data.prediction);
      setMessage("Prediction completed successfully!");
    } catch (err) {
      console.error("Prediction error:", err);
      setMessage(err.response?.data?.error || "Prediction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPredictionColor = (pred) => {
    switch (pred) {
      case "Low":
        return "text-red-600 bg-red-50";
      case "High":
        return "text-green-600 bg-green-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPredictionIcon = (pred) => {
    switch (pred) {
      case "Low":
        return <TrendingDown className="w-6 h-6" />;
      case "High":
        return <TrendingUp className="w-6 h-6" />;
      case "Medium":
        return <Minus className="w-6 h-6" />;
      default:
        return <BarChart3 className="w-6 h-6" />;
    }
  };

  if (isLoadingStudents) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Sidebar />
        <div className="flex-1 p-2 ml-72 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading students...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar />
      <div className="flex-1 p-2 ml-72">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Student Performance Prediction</h1>
            </div>
            <p className="text-gray-600">Use AI to predict student academic performance based on various factors</p>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Users className="w-4 h-4" />
                  Select Student
                </label>
                <select
                  value={selectedStudentId}
                  onChange={handleStudentChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.student_id} - {s.first_name} {s.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Auto-filled Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Calendar className="w-4 h-4" />
                    Attendance (%)
                  </label>
                  <input
                    type="number"
                    name="attendance"
                    value={form.attendance}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Award className="w-4 h-4" />
                    Average Test Score
                  </label>
                  <input
                    type="number"
                    name="avg_test_score"
                    value={form.avg_test_score}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Auto-filled and Read-only Project/Assignment Scores */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FileText className="w-4 h-4" />
                    Project Score
                  </label>
                  <input
                    type="number"
                    name="project_score"
                    value={form.project_score}
                    readOnly // Make read-only
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                    placeholder="Auto-filled"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <BookOpen className="w-4 h-4" />
                    Assignment Score
                  </label>
                  <input
                    type="number"
                    name="assignment_score"
                    value={form.assignment_score}
                    readOnly // Make read-only
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                    placeholder="Auto-filled"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Clock className="w-4 h-4" />
                    Study Hours per Day
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    name="study_hours"
                    value={form.study_hours}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="24"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter study hours"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <AlertCircle className="w-4 h-4" />
                    Past Backlogs
                  </label>
                  <input
                    type="number"
                    name="past_backlogs"
                    value={form.past_backlogs}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter past backlogs"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI is Predicting...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Predict Performance
                  </>
                )}
              </button>
            </form>

            {/* Loading Animation */}
            {isLoading && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-center space-x-3">
                  <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
                <p className="text-blue-700 text-center mt-2 font-medium">
                  AI is analyzing student data and predicting performance...
                </p>
                <div className="mt-3 bg-blue-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                </div>
              </div>
            )}

            {/* Message Display */}
            {message && !isLoading && (
              <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
                message.includes('failed') || message.includes('Failed') || message.includes('fill')
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {message.includes('failed') || message.includes('Failed') || message.includes('fill') ? (
                  <XCircle className="w-5 h-5" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                <span className="font-medium">{message}</span>
              </div>
            )}

            {/* Prediction Result */}
            {prediction && !isLoading && (
              <div className="mt-6 p-6 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">AI Prediction Result</h3>
                  <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${getPredictionColor(prediction)} border-2 border-current`}>
                    {getPredictionIcon(prediction)}
                    <span className="text-xl font-bold">
                      {prediction} Performance
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Based on the provided academic data and AI analysis
                  </p>

                  {/* Additional Info */}
                  <div className="mt-4 text-xs text-gray-500">
                    <p>Student ID: {selectedStudentId} | Prediction completed at {new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictStudent;
