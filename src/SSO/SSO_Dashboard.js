import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../Navigation.module.css';

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
  const navigate = useNavigate(); 
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = JSON.parse(authToken);

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/');
    }
  }, [loggedInUser, navigate]); // Include user and navigate in the dependency array

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
      <div className={styles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']}/>
        {createSidebarLink("/account", "Account", AccountBoxIcon)}
        {createSidebarLink("/sso-student", "Student", SchoolIcon)}
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
        {loggedInUser && (
          <h2>Welcome, {loggedInUser.firstname} {loggedInUser.lastname}!</h2>
        )}
      </div>
    </div>
  );
}

export default SSO_Dashboard;
