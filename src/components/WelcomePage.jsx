import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import '../styles/WelcomePage.css';

function WelcomePage() {
  const navigate = useNavigate(); // Use useNavigate hook to get navigate function

  const handleClick = () => {
    // Redirect to profile setup page or perform any other navigation logic
    navigate('/profile'); // Use navigate function for navigation
  };

  return (
    <div className="welcome-page">
      <h2>Welcome to theGarage</h2>
      <p>Start your journey by creating your profile.</p>
      <button type="button" onClick={handleClick}>Create Your Profile</button>
    </div>
  );
}

export default WelcomePage;
