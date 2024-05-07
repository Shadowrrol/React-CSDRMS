import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../Navigation.module.css'; // Import CSS module
import styles1 from '../GlobalForm.module.css'; // Import GlobalForm CSS module

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

const RegisterPrincipal = () => {
  const [userData, setUserData] = useState({
    uid: '',
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: '',
    userType: 2 // Principal
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/user/registerPrincipal', userData);
      console.log(response.data); // Handle success response
    } catch (error) {
      console.error('Error:', error); // Handle error
    }
  };

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
      <div className={styles1.content}>
        <div className={styles1.contentform}>
          <h2>Register as Principal</h2>
          <form onSubmit={handleSubmit} className={styles1['form-container']}>
            <div className={styles1['form-group']}>
              <label htmlFor="username">Username:</label>
              <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            </div>
            <div className={styles1['form-group']}>
              <label htmlFor="password">Password:</label>
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            </div>
            <div className={styles1['form-group']}>
              <label htmlFor="firstname">First Name:</label>
              <input type="text" name="firstname" placeholder="First Name" onChange={handleChange} required />
            </div>
            <div className={styles1['form-group']}>
              <label htmlFor="lastname">Last Name:</label>
              <input type="text" name="lastname" placeholder="Last Name" onChange={handleChange} required />
            </div>
            <div className={styles1['form-group']}>
              <label htmlFor="email">Email:</label>
              <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            </div>
            <button type="submit" className={styles1['global-button']}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPrincipal;
