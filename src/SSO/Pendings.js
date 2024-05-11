import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Navigation.module.css'; // Import CSS module

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Pendings = () => {
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = JSON.parse(authToken);
    const navigate = useNavigate(); 
    const createSidebarLink = (to, text, IconComponent) => (
        <Link to={to} className={styles['styled-link']}>
            <IconComponent className={styles.icon} /> {/* Icon */}
            <span className={styles['link-text']}>{text}</span> {/* Text */}
        </Link>
    );

    const handleLogout = () => {
        // Clear the authentication token from localStorage
        localStorage.removeItem('authToken');
        // Redirect the user to the login page
        navigate('/');
    };

        return (
            <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
                <div className={styles.sidenav}>
                    <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']} />
                    {createSidebarLink("/report", "Report", AssessmentIcon)}
                    {loggedInUser.userType !== 2 && createSidebarLink("/account", "Account", AccountBoxIcon)}
                    {loggedInUser.userType !== 2 && createSidebarLink("/student", "Student", SchoolIcon)}
                    {loggedInUser.userType !== 2 && createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                    {loggedInUser.userType !== 2 && createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
                    {loggedInUser.userType !== 2 && createSidebarLink("/case", "Case", PostAddIcon)}
                    {createSidebarLink("/pendings", "Pendings", PendingActionsIcon)}
                    {loggedInUser.userType !== 1 && loggedInUser.userType !== 3 && createSidebarLink("/viewSanctions", "Sanctions", LocalPoliceIcon)}
                    {loggedInUser.userType !== 2 && createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
                    <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
                </div>
                <div className={styles.content}>
                    <h1>pendings</h1>
                </div>
            </div>
        );
}

export default Pendings;
