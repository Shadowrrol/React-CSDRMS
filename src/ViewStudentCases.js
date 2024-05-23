import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Navigation.module.css';  

import AssessmentIcon from "@mui/icons-material/Assessment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
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
    <div className={styles.wrapper} style={{ backgroundImage: "url(/public/image-2-3@2x.png)" }}>
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
      <div>
        <h2>Cases for Student ID: {sid}</h2>
        <ul>
          {cases.map(singleCase => (
            <li key={singleCase.cid}>
              <div>Case Name: {singleCase.case_name}</div>
              <div>Investigator: {singleCase.investigator}</div>
              <div>Violation: {singleCase.violation}</div>
              <div>Description: {singleCase.description}</div>
              <div>Status: {singleCase.status}</div>
            </li>
          ))}
        </ul>        
      </div>      
    </div>
  );
};

export default ViewStudentCases;
