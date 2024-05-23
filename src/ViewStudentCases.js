import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Navigation.module.css';  
import styles1 from './GlobalDesign.module.css';

import AssessmentIcon from "@mui/icons-material/Assessment";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";

const ViewStudentCases = () => {
    const { sid } = useParams();
    const navigate = useNavigate();    
    const [cases, setCases] = useState([]);

    const handleLogout = () => {
        // Clear the authentication token from localStorage
        localStorage.removeItem("authToken");
        // Redirect the user to the login page
        navigate("/");
    };

    useEffect(() => {
        document.title = "Student Cases";
        const fetchCases = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/cases/student/${sid}`);
                setCases(response.data);
            } catch (error) {
                console.error('Error fetching cases:', error);
            }
        };
        fetchCases();
    }, [sid]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={styles["sidebar-logo"]} />
                <Link to="/report" className={styles["styled-link"]}>
                    <AssessmentIcon className={styles.icon} />
                    <span className={styles["link-text"]}>Report</span>
                </Link>
                <Link to="/viewSanctions" className={styles["styled-link"]}>
                    <LocalPoliceIcon className={styles.icon} />
                    <span className={styles["link-text"]}>Sanctions</span>
                </Link>
                <button className={styles["logoutbtn"]} onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <div className={styles.content}>
                <div className={styles1.box}>
                    <div className={styles1.maroonbox}>
                        <h2 style={{ color: "white" }}>Cases for Student ID: {sid}</h2>
                    </div>
                      <div className={styles1.sanctionsGrid}>
                        {cases.map(singleCase => (
                            <div key={singleCase.cid} className={styles1.sanctionItem}>
                                <div className={styles1.gridItem}><span className={styles1.label}>Case Name:</span> {singleCase.case_name}</div>
                                <div className={styles1.gridItem}><span className={styles1.label}>Investigator:</span> {singleCase.investigator}</div>
                                <div className={styles1.gridItem}><span className={styles1.label}>Violation:</span> {singleCase.violation}</div>
                                <div className={styles1.gridItem}><span className={styles1.label}>Description:</span> {singleCase.description}</div>
                                <div className={styles1.gridItem}><span className={styles1.label}>Status:</span> {singleCase.status}</div>
                            </div>
                        ))}
                      </div>
                </div>      
            </div>      
        </div>
    );
};

export default ViewStudentCases;
