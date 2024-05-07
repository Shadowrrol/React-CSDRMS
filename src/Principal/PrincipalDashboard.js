import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import styles from '../Navigation.module.css'; // Import CSS module

import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';

const PrincipalDashboard = () => {
  // Access location state to get userInfo
  const location = useLocation();
  const userInfo = location.state ? location.state.userInfo : null;
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout functionality, e.g., clear tokens
    localStorage.removeItem('authToken');
    // Then navigate to the login page
    navigate('/');
  };

  return (
    <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
      <div className={styles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']}/>
        <Link to="/report" className={styles['styled-link']}>
          <AssessmentIcon className={styles.icon} /> 
          <span className={styles['link-text']}>Report</span> 
        </Link>
        <Link to="/pendings" className={styles['styled-link']}>
          <PendingActionsIcon className={styles.icon} /> 
          <span className={styles['link-text']}>Pendings</span> 
        </Link>
        <Link to="/viewSanctions" className={styles['styled-link']}>
          <LocalPoliceIcon className={styles.icon} /> 
          <span className={styles['link-text']}>Sanctions</span> 
        </Link>
        <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
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
