import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './TimeLog.module.css'; 
import navStyles from '../Navigation.module.css'; 
import AdviserTimeLogModal from './AdviserTimeLogModal'; // Import the modal

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
    const [advisers, setAdvisers] = useState([]); // Changed from timeLogs to advisers
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
        const fetchAdvisers = async () => {
            try {
                // Updated to fetch advisers instead of time logs
                const response = await axios.get('http://localhost:8080/user/getAllAdvisers');
                setAdvisers(response.data);
            } catch (err) {
                setError('Failed to fetch advisers');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdvisers();
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

    // Filter advisers based on search query
    const filteredAdvisers = advisers.filter(adviser => {
        const fullName = `${adviser.firstname} ${adviser.middlename || ''} ${adviser.lastname}`.toLowerCase();
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
                <h1>Advisers List</h1>

                {/* Search input for filtering advisers */}
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
                                <th>Adviser First Name</th>
                                <th>Adviser Last Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAdvisers.map(adviser => (
                                <tr key={adviser.adviser_id}>
                                    <td>{adviser.firstname}</td>
                                    <td>{adviser.lastname}</td>
                                    <td>
                                        <button 
                                            className={styles.viewButton} 
                                            onClick={() => openModal(adviser)}
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
