import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Navigation.module.css';
import AssessmentIcon from '@mui/icons-material/Assessment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';

const ViewStudentSanctions = () => {
    const { sid } = useParams();
    const navigate = useNavigate();
    const [sanctions, setSanctions] = useState([]);

    const handleLogout = () => {
        // Clear the authentication token from localStorage
        localStorage.removeItem('authToken');
        // Redirect the user to the login page
        navigate('/');
    };

    useEffect(() => {
        document.title = 'Student Sanctions';
        const fetchSanctions = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/sanction/getSanctionsBySid/${sid}`);
                setSanctions(response.data);
            } catch (error) {
                console.error('Error fetching sanctions:', error);
            }
        };
        fetchSanctions();
    }, [sid]);

    return (
        <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
            <div className={styles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']} />
                <Link to="/report" className={styles['styled-link']}>
                    <AssessmentIcon className={styles.icon} />
                    <span className={styles['link-text']}>Report</span>
                </Link>
                <Link to="/viewSanctions" className={styles['styled-link']}>
                    <LocalPoliceIcon className={styles.icon} />
                    <span className={styles['link-text']}>Sanctions</span>
                </Link>
                <button className={styles.logoutbtn} onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <div>
                <h2>Sanctions for Student ID: {sid}</h2>
                <ul>
                    {sanctions.map((sanction) => (
                        <li key={sanction.sanction_id}>
                            <div>Behavior Details: {sanction.behaviorDetails}</div>
                            <div>Sanction Recommendation: {sanction.sanctionRecommendation}</div>
                            <div>Status: {sanction.isApproved === 1 ? 'Approved' : sanction.isApproved === 2 ? 'Declined' : 'Pending'}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ViewStudentSanctions;
