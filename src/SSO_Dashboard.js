import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import './SSO_Dashboard.css';
import styles from './Navigation.module.css'; // Import CSS module

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';

const createSidebarLink = (to, text, IconComponent) => (
  <Link to={to} className={styles['styled-link']}>
      <IconComponent className={styles.icon} /> 
      <span className={styles['link-text']}>{text}</span> 
  </Link>
);

const SSO_Dashboard = () => {
  // Access location state to get userInfo
  const navigate = useNavigate(); 
  const location = useLocation();
  const userObject = location.state ? location.state.userObject : null;

  const handleLogout = () => {
    // Clear the authentication token from localStorage
    localStorage.removeItem('authToken');
    // Redirect the user to the login page
    navigate('/');
  };

  React.useEffect(() => {
    if (!userObject) {
      // If userObject is null or undefined, redirect to login page
      navigate('/');
    }
  }, []);



  return (
    <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
    <div className={styles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']}/>
        {createSidebarLink("/account", "Account", AccountBoxIcon)}
        {createSidebarLink("/student", "Student", SchoolIcon)}
        {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
        {createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
        {createSidebarLink("/case", "Case", PostAddIcon)}
        {createSidebarLink("/pendings", "Pendings", PendingActionsIcon)}
        {createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
        {createSidebarLink("/report", "Report", AssessmentIcon)}
        <button onClick={handleLogout}>Logout</button>
    </div>
      <div className='content'>
        <h1>SSO Dashboard</h1>
        {/* Display first name and last name if userInfo is available */}
         {userObject && (
          <h2>Welcome, {userObject.firstname} {userObject.lastname}!</h2>
        )}
        {/* Content */}
      </div>
    </div>
  );
}

export default SSO_Dashboard;
