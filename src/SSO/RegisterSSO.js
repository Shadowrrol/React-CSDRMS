import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Navigation.module.css'; // Import CSS module
import styles1 from '../GlobalForm.module.css'; // Import GlobalForm CSS module

import MenuPopupState from '../components/MenuPopupState';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AssessmentIcon from '@mui/icons-material/Assessment';

const createSidebarLink = (to, text, IconComponent) => (
  <Link to={to} className={styles['styled-link']}>
      <IconComponent className={styles.icon} /> {/* Icon */}
      <span className={styles['link-text']}>{text}</span> {/* Text */}
  </Link>
);

const RegisterSSO = () => {
  const navigate = useNavigate(); 
  const handleLogout = () => {
    // Clear the authentication token from localStorage
    localStorage.removeItem('authToken');
    // Redirect the user to the login page
    navigate('/');
  };
  const [userData, setUserData] = useState({
    uid: '',
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: '',
    userType: 1 // SSO
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/user/registerSSO', userData);
      console.log(response.data); // Handle success response
    } catch (error) {
      console.error('Error:', error); // Handle error
    }
  };

  return (
    <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
        <div className={styles.sidenav}>
          <img src="/image-removebg-preview (1).png" alt="Logo" className={styles['sidebar-logo']} />
          {createSidebarLink("/AdminDashboard", "Dashboard", AssessmentIcon)}
          {createSidebarLink("/account", "Account", AccountBoxIcon)}
          {createSidebarLink("/class", "Class", MeetingRoomIcon)}
          <MenuPopupState />
        </div>
        <div className={styles1.content}>
          <div className={styles1.contentform}>
            <h2>Register as SSO</h2>
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

export default RegisterSSO;
