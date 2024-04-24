import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../SSO_Dashboard.css';

const PrincipalDashboard = () => {
  // Access location state to get userInfo
  const location = useLocation();
  const userInfo = location.state ? location.state.userInfo : null;

  return (
    <div className='wrapper'>
      <div className="sidenav">
        {/* Navigation links */}
        <Link to="/report">Report</Link>
        <Link to="/pendings">Pendings</Link>
        <Link to="/viewSanctions">Sanctions</Link>
      </div>
      <div className='content'>
        <h1>Principal Dashboard</h1>
        {/* Display first name and last name if userInfo is available */}
        {userInfo && (
          <h2>Welcome, {userInfo.firstname} {userInfo.lastname}!</h2>
        )}
        {/* Content */}
      </div>
    </div>
  );
}

export default PrincipalDashboard;
