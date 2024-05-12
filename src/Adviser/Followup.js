import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Navigation.module.css';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PostAddIcon from '@mui/icons-material/PostAdd';

const Followup = () => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = JSON.parse(authToken);
  const navigate = useNavigate();
  const [followups, setFollowups] = useState([]);

  useEffect(() => {
    const fetchFollowups = async () => {
      try {
        const response = await fetch(`http://localhost:8080/followup/getAllFollowUpsByAdviser/${loggedInUser.uid}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFollowups(data);
      } catch (error) {
        console.error('Failed to fetch follow-ups:', error);
      }
    };

    fetchFollowups();
  }, [loggedInUser.adviserId]);

  const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={styles['styled-link']}>
        <IconComponent className={styles.icon} /> 
        <span className={styles['link-text']}>{text}</span> 
    </Link>
  );

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
      <div className={styles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']}/>
        {createSidebarLink("/report", "Report", AssessmentIcon)}
        {createSidebarLink("/student", "Student", SchoolIcon)}
        {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
        {createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
        {createSidebarLink("/case", "Case", PostAddIcon)}
        {createSidebarLink("/Followup", "Followups", PostAddIcon)}
        <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
      </div>
      <div className='content'>
        <h1>Follow ups</h1>
        <ul>
          {followups.map(followup => (
            <li key={followup.id}>
             <p>Hello Adviser <b>{loggedInUser.firstname}</b></p>
             <p>You're Student <b>{followup.caseEntity.student.firstname} {followup.caseEntity.student.lastname}</b> needs to go at the sso</p>
              <p>Date: <b>{followup.date}</b></p>
              <p>Time: <b>{followup.time}</b></p>
              <p>Case: <b>{followup.caseEntity.case_name}</b></p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Followup;
