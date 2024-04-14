import React from 'react';
import { useLocation } from 'react-router-dom';

const AdviserDashboard = () => {
    const location = useLocation();
  const { userInfo } = location.state;
  // Sample data for the dashboard
  const data = {
    users: 100,
    revenue: "$10,000",
    orders: 50,
    visits: 2000
  };

  return (
    <div>
       <h2>AdviserDashboard</h2>
            {/* Display first name and last name */}
      <h2>Welcome, {userInfo.firstname} {userInfo.lastname}!</h2>
    </div>
  );
}

export default AdviserDashboard;
