import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Notification.css';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';

const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className="styled-link">
        <IconComponent className="icon" /> {/* Icon */}
        <span className="link-text">{text}</span> {/* Text */}
    </Link>
);

const Notification = () => {
  // Access location state to get userInfo
  const location = useLocation();
  const userInfo = location.state ? location.state.userInfo : null;

  return (
    <div className="wrapper" style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
            <div className="sidenav">
                <img src="/image-removebg-preview (1).png" alt="" className="sidebar-logo"/>
                {createSidebarLink("/account", "Account", AccountBoxIcon)}
                {createSidebarLink("/student", "Student", SchoolIcon)}
                {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
                {createSidebarLink("/case", "Case", PostAddIcon)}
                {createSidebarLink("/pendings", "Pendings", PendingActionsIcon)}
                {createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
                {createSidebarLink("/report", "Report", AssessmentIcon)}
            </div>
        <div className='content'>
            <h1>Notif</h1>
        </div>
    </div>
  );
}

export default Notification;
