import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Navigation.module.css';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import styles1 from './GlobalDesign.module.css';

const ViewStudentSuspensions = () => {
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
        <div className={styles.wrapper}>
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
            <div className={styles.content}>
                <div className={styles1.box}>
                    <div className={styles1.maroonbox}>
                        <h2 style={{ color: "white" }}>Sanctions for Student ID: {sid}</h2>
                    </div>
                    <div className={styles1.sanctionsGrid}>
                        {sanctions.map((sanction) => (
                            <div key={sanction.sanction_id} className={styles1.sanctionItem}>
                                <div className={styles1.gridItem}><span className={styles1.label}>Behavior Details:</span> {sanction.behaviorDetails}</div>
                                <div className={styles1.gridItem}><span className={styles1.label}>Sanction Recommendation:</span> {sanction.sanctionRecommendation}</div>
                                <div className={styles1.gridItem}><span className={styles1.label}>Status:</span> {sanction.isApproved === 1 ? 'Approved' : sanction.isApproved === 2 ? 'Declined' : 'Pending'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewStudentSuspensions;
