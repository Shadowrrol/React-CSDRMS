import React from 'react';
import { useLocation } from 'react-router-dom';

const AdminDashboard = () => {
    const location = useLocation();
  const { userInfo } = location.state;
  // Sample data for the dashboard
 

  return (
    <div>
        <h2>AdminDashboard</h2>
            {/* Display first name and last name */}
      <h2>Welcome, {userInfo.firstname} {userInfo.lastname}!</h2>  
    </div>
  );
}

export default AdminDashboard;
