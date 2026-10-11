import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import TeacherLogin from './components/TeacherLogin';
import TeacherSignup from './components/TeacherSignup';
import TeacherLogout from './components/TeacherLogout';
import TeacherDashboard from './components/TeacherDashboard';
import AddStudent from './components/AddStudent';
import StudentList from './components/StudentList';
import AttendancePage from './components/AttendancePage';
import ViewAttendance from './components/ViewAttendance'
import Courses from './components/CoursePage'
import SemesterPage from './components/SemesterPage';
import MarksPage from './components/MarksPage';
import SubjectsPage from './components/SubjectsPage';
import PredictPage from './components/PredictForm';

import StudentLogin from './components/student/StudentLogin';
import StudentDashboard from './components/student/StudentDashboard';
import StudentChat from './components/student/StudentChat';
import StudentPerformance from './components/student/Aiperformance'
import StudentAttendance from './components/student/StudentAttendance';
import StudentResource from './components/student/StudentResourse';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<TeacherLogin /> }/>
        <Route path="/signup" element={ <TeacherSignup /> } />
        <Route path="/logout" element={<ProtectedRoute> <TeacherLogout /> </ProtectedRoute> } />
        <Route path="/dashboard" element={<ProtectedRoute> <TeacherDashboard /> </ProtectedRoute>} />
        <Route path="/add-student" element={<ProtectedRoute> <AddStudent /> </ProtectedRoute>} />  
        <Route path="/view-students" element={<ProtectedRoute> <StudentList /> </ProtectedRoute>} />  
        <Route path="/attendance" element={<ProtectedRoute> <AttendancePage /> </ProtectedRoute>} />  
        <Route path="/view-attendance" element={<ProtectedRoute> <ViewAttendance /> </ProtectedRoute>} />  
        <Route path="/courses" element={<ProtectedRoute> <Courses /> </ProtectedRoute>} />
        <Route path="/semesters" element={<ProtectedRoute> <SemesterPage /> </ProtectedRoute>} />
        <Route path="/marks" element={<ProtectedRoute> <MarksPage /> </ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute> <SubjectsPage /> </ProtectedRoute>} />
        <Route path="/prediction" element={<ProtectedRoute> <PredictPage /> </ProtectedRoute>} />

        <Route path='/student-login' element={<StudentLogin />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-chat" element={<StudentChat />} />
        <Route path='/student-performance' element={<StudentPerformance />} />
        <Route path='/student-attendance' element={<StudentAttendance />} />
        <Route path='/student-resources' element={<StudentResource />} />

      </Routes>
    </Router>
  );
}

export default App;
