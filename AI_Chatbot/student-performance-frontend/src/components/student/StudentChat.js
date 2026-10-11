import React, { useState, useEffect } from "react";
import { 
  Send, 
  Bot, 
  User, 
  MessageCircle, 
  ArrowLeft, 
  Loader2,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentChat = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hello! I'm your academic assistant. Ask me anything!", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get student data from localStorage
    try {
      const stored = JSON.parse(localStorage.getItem("student"));
      if (stored && stored.id) {
        setStudentId(stored.id);
      } else {
        setError("Student information not found. Please log in again.");
      }
    } catch (err) {
      console.error("Error parsing student data:", err);
      setError("Error loading student information.");
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !studentId || loading) return;

    const userMessage = { from: "user", text: input, timestamp: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(" http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          student_id: studentId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || "❌ I didn't understand that.";
      
      setMessages([...updatedMessages, { 
        from: "bot", 
        text: reply, 
        timestamp: new Date() 
      }]);
    } catch (err) {
      console.error("❌ Chat Error:", err.message);
      let errorMessage = "⚠️ Failed to get response from server.";
      
      if (err.message.includes("Failed to fetch")) {
        errorMessage = "⚠️ Unable to connect to the server. Please check your connection.";
      } else if (err.message.includes("500")) {
        errorMessage = "⚠️ Server error. Please try again later.";
      } else if (err.message.includes("404")) {
        errorMessage = "⚠️ Chat service not available. Please contact support.";
      }
      
      setMessages([
        ...updatedMessages,
        { 
          from: "bot", 
          text: errorMessage, 
          timestamp: new Date() 
        }
      ]);
      setError("Connection error. Please try again.");
    }

    setInput("");
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Academic Assistant</h1>
                <p className="text-gray-600 mt-1">Get instant help with your studies and questions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">AI Chat Assistant</h2>
                  <p className="text-blue-100 text-sm">Always ready to help with your academic needs</p>
                </div>
              </div>
              
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                  {error ? (
                    <>
                      <WifiOff className="w-4 h-4 text-red-200" />
                      <span className="text-xs text-red-200">Offline</span>
                    </>
                  ) : (
                    <>
                      <Wifi className="w-4 h-4 text-green-200" />
                      <span className="text-xs text-green-200">Online</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Error Banner */}
            {error && (
              <div className="mt-4 bg-red-500/20 border border-red-300/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-200" />
                  <span className="text-sm text-red-100">{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-start space-x-3 max-w-xs md:max-w-md ${msg.from === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.from === "user" 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600" 
                      : "bg-gradient-to-r from-green-500 to-emerald-600"
                  }`}>
                    {msg.from === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`relative px-4 py-3 rounded-2xl shadow-lg ${
                    msg.from === "user"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>
                    <div className={`flex items-center space-x-1 mt-2 text-xs ${
                      msg.from === "user" ? "text-blue-100" : "text-gray-400"
                    }`}>
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(msg.timestamp)}</span>
                    </div>
                    
                    {/* Message tail */}
                    <div className={`absolute top-4 w-3 h-3 transform rotate-45 ${
                      msg.from === "user" 
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 -right-1" 
                        : "bg-white border-l border-b border-gray-200 -left-1"
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-xs">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg px-4 py-3 border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <textarea
                  placeholder={!studentId ? "Please log in to start chatting..." : "Type your question here... (Press Enter to send)"}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows="1"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                  disabled={!studentId}
                />
                <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                  Enter to send
                </div>
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading || !studentId}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                title={!studentId ? "Please log in to chat" : loading ? "Sending..." : "Send message"}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="w-6 h-6" />
            <h3 className="text-lg font-bold">What I Can Help With</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Academic questions & explanations</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Study tips & strategies</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Assignment guidance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentChat;