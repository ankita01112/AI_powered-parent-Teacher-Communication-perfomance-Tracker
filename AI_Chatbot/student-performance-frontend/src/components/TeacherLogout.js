import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // If using React Router

const TeacherLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear token and any other user data
    localStorage.removeItem('token');
    localStorage.removeItem('teacherName');

    // Optionally navigate back to login or home page
    navigate('/login'); // Or navigate('/'), depending on your routing
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default TeacherLogout;
