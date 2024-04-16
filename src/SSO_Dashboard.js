import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const SSO_Dashboard = () => {
  // Access location state to get userInfo
  const location = useLocation();
  const { userInfo } = location.state;

  return (
    <div>
      <h1>SSO Dashboard</h1>
      {/* Display first name and last name */}
      <h2>Welcome, {userInfo.firstname} {userInfo.lastname}!</h2>
      
      {/* Navigation link to Account */}
      <Link to="/account">Account</Link>
      <br></br>
      <Link to="/student">Student</Link>
    </div>
  );
}

export default SSO_Dashboard;
