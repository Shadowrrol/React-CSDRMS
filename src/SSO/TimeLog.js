import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles2 from './TimeLog.module.css'; 
import styles from '../Navigation.module.css';// Make sure to create this CSS file for styling if needed

import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={styles['styled-link']}>
        <IconComponent className={styles.icon} />
        <span className={styles['link-text']}>{text}</span>
    </Link>
);

const TimeLog = () => {
    const [timeLogs, setTimeLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = JSON.parse(authToken);
    const { section, schoolYear, userType, uid } = loggedInUser;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTimeLogs = async () => {
            try {
                const response = await axios.get('http://localhost:8080/time-log/getAll');
                setTimeLogs(response.data);
            } catch (err) {
                setError('Failed to fetch time logs');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTimeLogs();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleLogout = async () => {
        console.log("userId:",uid)
        const logoutTime = new Date().toISOString();
        try {
            // Fetch timeLogId using userId
            const response = await axios.get(`http://localhost:8080/time-log/getLatestLog/${uid}`);
            const { timelog_id: timelogId } = response.data; // Destructure timeLogId

            console.log("1: ",timelogId);
            console.log("2: ",logoutTime);
            // Send logout time to backend
            await axios.post('http://localhost:8080/time-log/logout', {
                timelogId, // Use timeLogId
                logoutTime,
            });

            // Clear tokens and navigate to login
            localStorage.removeItem('authToken');
            navigate('/');
        } catch (error) {
            console.error('Error logging out', error);
        }
    };

    return (
        <div className={styles.wrapper}>
             <div className={styles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']} />
                {createSidebarLink("/report", "Record", AssessmentIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/student", "Student", SchoolIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {loggedInUser.userType !== 2 && (
                    <>
                        {loggedInUser.userType === 3
                            ? createSidebarLink("/adviserCase", "Case", PostAddIcon)
                            : createSidebarLink("/case", "Case", PostAddIcon)}
                    </>
                )}
                {loggedInUser.userType !== 1 && loggedInUser.userType !== 3 && createSidebarLink("/viewSanctions", "Sanctions", LocalPoliceIcon)}
                {loggedInUser.userType === 1 && createSidebarLink("/timeLog", "Time Log", AccessTimeFilledIcon)}
                <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
            </div>
        <div className={styles2.container}>
            <h1>Time Logs</h1>
            <table className={styles2.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Login Time</th>
                        <th>Logout Time</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {timeLogs.map(log => (
                        <tr key={log.timelog_id}>
                            <td>{log.timelog_id}</td>
                            <td>{log.userId}</td>
                            <td>{new Date(log.loginTime).toLocaleString()}</td>
                            <td>{log.logoutTime ? new Date(log.logoutTime).toLocaleString() : 'Not logged out yet'}</td>
                            <td>{log.duration} minute/s</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default TimeLog;
