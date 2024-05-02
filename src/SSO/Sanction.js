import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import '../SSO_Dashboard.css';
import styles from '../Navigation.module.css'; // Import CSS module

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';

const createSidebarLink = (to, text, IconComponent) => (
  <Link to={to} className={styles['styled-link']}>
      <IconComponent className={styles.icon} /> {/* Icon */}
      <span className={styles['link-text']}>{text}</span> {/* Text */}
  </Link>
);

const Sanction = () => {
  const [sid, setSid] = useState('');
  const [behaviorDetails, setBehaviorDetails] = useState('');
  const [sanctionRecommendation, setSanctionRecommendation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/sanction/insertSanction', {
        sid,
        behaviorDetails,
        sanctionRecommendation
      });
      console.log(response.data); // log response from the server
      // Clear form fields after successful submission
      setSid('');
      setBehaviorDetails('');
      setSanctionRecommendation('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //{createSidebarLink("/Followup", "Follow-up", AssessmentIcon)}

  return (
    <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
        <div className={styles.sidenav}>
            <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']}/>
            {createSidebarLink("/account", "Account", AccountBoxIcon)}
            {createSidebarLink("/student", "Student", SchoolIcon)}
            {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
            {createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
            {createSidebarLink("/case", "Case", PostAddIcon)}
            {createSidebarLink("/pendings", "Pendings", PendingActionsIcon)}
            {createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
            {createSidebarLink("/report", "Report", AssessmentIcon)}
        </div>
      <div className='content'>
        <h1>Sanctions</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="sid">Student ID:</label>
          <input type="text" id="sid" value={sid} onChange={(e) => setSid(e.target.value)} required />
          <label htmlFor="behaviorDetails">Behavior Details:</label>
          <textarea id="behaviorDetails" value={behaviorDetails} onChange={(e) => setBehaviorDetails(e.target.value)} required></textarea>
          <label htmlFor="sanctionRecommendation">Sanction Recommendation:</label>
          <textarea id="sanctionRecommendation" value={sanctionRecommendation} onChange={(e) => setSanctionRecommendation(e.target.value)} required></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Sanction;
