import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './TimeLog.module.css'; 
import navStyles from '../Navigation.module.css'; 

import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PostAddIcon from '@mui/icons-material/PostAdd';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={navStyles['styled-link']}>
        <IconComponent className={navStyles.icon} />
        <span className={navStyles['link-text']}>{text}</span>
    </Link>
);

const TimeLog = () => {
    const [timeLogs, setTimeLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = JSON.parse(authToken);
    const { uid } = loggedInUser;
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

    const handleLogout = async () => {
        const logoutTime = new Date().toISOString();
        try {
            const response = await axios.get(`http://localhost:8080/time-log/getLatestLog/${uid}`);
            const { timelog_id: timelogId } = response.data;

            await axios.post('http://localhost:8080/time-log/logout', {
                timelogId,
                logoutTime,
            });

            localStorage.removeItem('authToken');
            navigate('/');
        } catch (error) {
            console.error('Error logging out', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={navStyles.wrapper}>
            <div className={navStyles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="logo" className={navStyles['sidebar-logo']} />
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
                <button className={navStyles.logoutbtn} onClick={handleLogout}>Logout</button>
            </div>

            <div className={navStyles.content}>
                <h1>Time Logs</h1>
                <div className={styles['table-container']}>
                    <table className={styles['time-table']}>
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
        </div>
    );
};

export default TimeLog;
