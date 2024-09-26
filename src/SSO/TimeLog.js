import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './TimeLog.module.css'; 
import navStyles from '../Navigation.module.css'; 
import AdviserTimeLogModal from './AdviserTimeLogModal'; // Import the new modal

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
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [selectedAdviser, setSelectedAdviser] = useState(null); // Selected adviser state
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
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
        localStorage.removeItem("authToken");
        navigate("/");
    };

    const openModal = (adviser) => {
        setSelectedAdviser(adviser); // Set the selected adviser
        setIsModalOpen(true); // Open the modal
    };

    const closeModal = () => {
        setSelectedAdviser(null); // Clear the selected adviser
        setIsModalOpen(false); // Close the modal
    };

    // Filter time logs based on search query
    const filteredTimeLogs = timeLogs.filter(log => {
        const fullName = `${log.adviser.firstname} ${log.adviser.middlename || ''} ${log.adviser.lastname}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={navStyles.wrapper}>
            <div className={navStyles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="logo" className={navStyles['sidebar-logo']} />
                {createSidebarLink("/record", "Record", AssessmentIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/student", "Student", SchoolIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/report", "Report", PostAddIcon)}
                {loggedInUser.userType === 1 && createSidebarLink("/timeLog", "Time Log", AccessTimeFilledIcon)}
                <button className={navStyles.logoutbtn} onClick={handleLogout}>Logout</button>
            </div>

            <div className={navStyles.content}>
                <h1>Time Logs</h1>

                {/* Search input for filtering */}
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Search by adviser name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles['table-container']}>
                    <table className={styles['time-table']}>
                        <thead>
                            <tr>
                                <th>Adviser</th>
                                <th>Login Time</th>
                                <th>Logout Time</th>
                                <th>Duration</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTimeLogs.map(log => (
                                <tr key={log.timelog_id}>
                                    <td>{log.adviser.firstname} {log.adviser.middlename} {log.adviser.lastname}</td>
                                    <td>{new Date(log.loginTime).toLocaleString()}</td>
                                    <td>{log.logoutTime ? new Date(log.logoutTime).toLocaleString() : 'Not logged out yet'}</td>
                                    <td>{log.duration} minute/s</td>
                                    <td>
                                        <button 
                                            className={styles.viewButton} 
                                            onClick={() => openModal(log.adviser)}
                                        >
                                            View Time Logs
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Render the modal for displaying adviser-specific time logs */}
            {isModalOpen && (
                <AdviserTimeLogModal 
                    adviser={selectedAdviser} 
                    onClose={closeModal} 
                />
            )}
        </div>
    );
};

export default TimeLog;
