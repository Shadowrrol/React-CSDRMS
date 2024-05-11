import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Navigation.module.css'; // Import CSS module
import '../SSO/SSODashboard.css';

// Import icons from Material-UI
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PostAddIcon from '@mui/icons-material/PostAdd';

const AdviserDashboard = () => {
  // Access location state to get userInfo
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = JSON.parse(authToken);

  const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={styles['styled-link']}>
        <IconComponent className={styles.icon} /> 
        <span className={styles['link-text']}>{text}</span> 
    </Link>
  );

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
          {createSidebarLink("/report", "Report", AssessmentIcon)}
          {createSidebarLink("/student", "Student", SchoolIcon)}
          {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
          {createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
          {createSidebarLink("/case", "Case", PostAddIcon)}
          <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
      </div>
      <div className='content'>
        <h1>Adviser Dashboard</h1>
        {/* Display first name and last name if userInfo is available */}
        {loggedInUser && (
          <h2>Welcome, {loggedInUser.firstname} {loggedInUser.lastname}!</h2>
        )}
        {/* Content */}
      </div>
    </div>
  );
}

export default AdviserDashboard;
