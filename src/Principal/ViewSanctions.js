import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Navigation.module.css'; // Import CSS module

import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';

const ViewSanctions = () => {
  const navigate = useNavigate(); 
  const [sanctions, setSanctions] = useState([]);

  useEffect(() => {
    const fetchSanctions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/sanction/getAllPendingSanctions');
        console.log('Fetched sanctions:', response.data);
        setSanctions(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchSanctions();
  }, []);

  const handleLogout = () => {
    // Clear the authentication token from localStorage
    localStorage.removeItem('authToken');
    // Redirect the user to the login page
    navigate('/');
  };

  const handleApprove = async (sanctionId) => {
    try {
      const response = await axios.post('http://localhost:8080/sanction/approveSanction', null, {
        params: {
          sanctionId: sanctionId
        }
      });
      console.log(response.data); // log response from the server
      // Refresh sanctions after approval
      const updatedSanctions = sanctions.map(sanction => {
        if (sanction.sanction_id === sanctionId) {
          sanction.isApproved = 1;
        }
        return sanction;
      });
      setSanctions(updatedSanctions);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  const handleDecline = async (sanctionId) => {
    try {
        const response = await axios.post('http://localhost:8080/sanction/declineSanction', null, {
          params: {
            sanctionId: sanctionId
          }
        });
        console.log(response.data); // log response from the server
        // Refresh sanctions after approval
        const updatedSanctions = sanctions.map(sanction => {
          if (sanction.sanction_id === sanctionId) {
            sanction.isApproved = 2;
          }
          return sanction;
        });
        setSanctions(updatedSanctions);
      } catch (error) {
        console.error('Error:', error);
      }
  };

  return (
    <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
      <div className={styles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']}/>
        <Link to="/report" className={styles['styled-link']}>
          <AssessmentIcon className={styles.icon} /> 
          <span className={styles['link-text']}>Report</span> 
        </Link>
        <Link to="/viewSanctions" className={styles['styled-link']}>
          <LocalPoliceIcon className={styles.icon} /> 
          <span className={styles['link-text']}>Sanctions</span> 
        </Link>
        <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
      </div>
      <div className='content'>
        <h1>Sanctions</h1>
        <div>
          <h2>All Sanctions</h2>
          <ul>
            {sanctions.map(sanction => (
              <li key={sanction.sanction_id}>
                {/* Display sanction details */}
                <div>Sanction ID: {sanction.sanction_id}</div>
                <div>Student Name: {sanction.student.firstname}  {sanction.student.lastname}</div>
                <div>Behavior Details: {sanction.behaviorDetails}</div>
                <div>Sanction Recommendation: {sanction.sanctionRecommendation}</div>
                {/* Approve and decline buttons */}
                {sanction.isApproved !== 1 && (
                  <div>
                    <button onClick={() => handleApprove(sanction.sanction_id)}>Approve</button>
                    <button onClick={() => handleDecline(sanction.sanction_id)}>Decline</button>
                  </div>
                )}
                {/* View associated cases, sanctions, and records */}
                <div>
                  <Link to={`/view-student-cases/${sanction.sid}`}>View Cases</Link><br></br>
                  <Link to={`/view-student-sanctions/${sanction.sid}`}>View Sanctions</Link><br></br>
                  <Link to={`/view-student-report/${sanction.sid}`}>View Records</Link><br></br>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
  
}

export default ViewSanctions;
