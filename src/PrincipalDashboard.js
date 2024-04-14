import React from 'react';
import { useLocation } from 'react-router-dom';

const PrincipalDashboard = () => {
    const location = useLocation();
  const { userInfo } = location.state;
  
  return (
    <div>
            <h2>PrincipalDashboard</h2>
      <h2>Welcome, {userInfo.firstname} {userInfo.lastname}!</h2>
    
    </div>
  );
}

export default PrincipalDashboard;
