import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css';
import styles2 from './Notification.module.css'; // Import CSS module

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
        <IconComponent className={styles.icon} /> {/* Icon */}
        <span className={styles['link-text']}>{text}</span> {/* Text */}
    </Link>
);

const Notification = () => {
    const navigate = useNavigate(); 
    const [sanctions, setSanctions] = useState([]);
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = JSON.parse(authToken);



    useEffect(() => {
    const fetchSanctions = async () => {
        try {
            let response;
            if (loggedInUser.userType === 3) {
                response = await fetch(`http://localhost:8080/sanction/getSanctionsBySectionAndSchoolYear?section=${loggedInUser.section}&schoolYear=${loggedInUser.schoolYear}`);
            } else {
                response = await fetch('http://localhost:8080/sanction/getApprovedAndDeclinedSanctions');
            }
            const data = await response.json();
            setSanctions(data);
        } catch (error) {
            console.error('Error fetching sanctions:', error);
        }
    };
    fetchSanctions();
}, [loggedInUser]);

    const handleLogout = () => {
        // Clear the authentication token from localStorage
        localStorage.removeItem('authToken');
        // Redirect the user to the login page
        navigate('/');
    };

    const getSanctionStatus = (isApproved) => {
        return isApproved === 1 ? 'Accepted' : isApproved === 2 ? 'Declined' : 'Pending';
    };

    return (
        <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
            <div className={styles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']} />
                {loggedInUser.userType !== 3 && createSidebarLink("/account", "Account", AccountBoxIcon)}
                {createSidebarLink("/student", "Student", SchoolIcon)}
                {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
                {createSidebarLink("/case", "Case", PostAddIcon)}
                {loggedInUser.userType !== 3 && createSidebarLink("/pendings", "Pendings", PendingActionsIcon)}
                {loggedInUser.userType !== 3 && createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
                {createSidebarLink("/report", "Report", AssessmentIcon)}
                <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
            </div>
            <div className={styles.content}>
                <h1>Notifications</h1>
                <div>
                    <h2>Approved and Declined Sanctions</h2>
                    <ul>
                        {sanctions.map(sanction => (
                            <li key={sanction.sanction_id}>
                                <div>Student Name: {sanction.student.firstname} {sanction.student.lastname}</div>
                                <div>Behavior Details: {sanction.behaviorDetails}</div>
                                <div>Sanction Recommendation: {sanction.sanctionRecommendation}</div>
                                <div><b>Status: {getSanctionStatus(sanction.isApproved)}</b></div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Notification;
