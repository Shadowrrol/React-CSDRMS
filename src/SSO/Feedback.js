import React, { useEffect, useState } from 'react';
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

const Feedback = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [error, setError] = useState(null); // State to handle errors
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = JSON.parse(authToken);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                let feedbackEndpoint = 'http://localhost:8080/feedback/getFeedbacks';
                if (loggedInUser.userType === 3) {
                    feedbackEndpoint = 'http://localhost:8080/feedback/getFeedbacksForAdviser?uid=' + loggedInUser.uid;
                }
                const response = await fetch(feedbackEndpoint);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setFeedbackList(data);
            } catch (error) {
                console.error('Failed to fetch feedback:', error);
                setError(error.message); // Set error message state
            }
        };
        fetchFeedback();
    }, []); // Include loggedInUser in the dependencies array

    const handleLogout = () => {
        // Clear the authentication token from localStorage
        localStorage.removeItem('authToken');
        // Redirect the user to the login page
        navigate('/');
    };

    const handleAcknowledge = async (feedbackId) => {
        try {
            const response = await fetch(`http://localhost:8080/feedback/acknowledge/${feedbackId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to acknowledge feedback');
            }
            // Update the feedback list to reflect the change
            setFeedbackList(prevFeedbackList => {
                return prevFeedbackList.map(feedback => {
                    if (feedback.fid === feedbackId) {
                        return { ...feedback, isAcknowledged: 1 };
                    }
                    return feedback;
                });
            });
        } catch (error) {
            setError(error.message); // Set error message state
        }
    };

    const createSidebarLink = (to, text, IconComponent) => (
        <Link to={to} className={styles['styled-link']}>
            <IconComponent className={styles.icon} /> {/* Icon */}
            <span className={styles['link-text']}>{text}</span> {/* Text */}
        </Link>
    );

    return (
        <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
            <div className={styles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']} />
                {createSidebarLink("/report", "Report", AssessmentIcon)}
                {loggedInUser.userType !== 3 && createSidebarLink("/account", "Account", AccountBoxIcon)}
                {createSidebarLink("/student", "Student", SchoolIcon)}
                {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
                {createSidebarLink("/case", "Case", PostAddIcon)}
                {loggedInUser.userType !== 3 && createSidebarLink("/pendings", "Pendings", PendingActionsIcon)}
                {loggedInUser.userType !== 3 && createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/Followup", "Followups", PostAddIcon)}
                <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
            </div>
            <div className={styles.content}>
                <h1>Feedback</h1>
                {error && <p>Error: {error}</p>} {/* Display error message */}
                <div>
                    {feedbackList.map((feedback) => (
                        <div key={feedback.fid}>
                            <p>Student: {feedback.caseEntity.student.firstname} {feedback.caseEntity.student.lastname}</p>
                            <p>Is Acknowledged: {feedback.isAcknowledged}</p>
                            <p>Result: {feedback.result}</p>
                            {loggedInUser.userType === 3 && !feedback.isAcknowledged && (
                                <button onClick={() => handleAcknowledge(feedback.fid)}>Acknowledge</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Feedback;
