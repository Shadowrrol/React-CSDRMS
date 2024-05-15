import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Navigation.module.css'; // Import CSS module
import styles1 from '../GlobalForm.module.css'; // Import RegisterAdviser CSS module

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

const RegisterAdviser = () => {
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
    grade: '',
    section: '',
    schoolYear: '',
    userType: 3 // Adviser
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'grade') {
      // Clear section when grade changes
      setUserData({ ...userData, [name]: value, section: '' });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/user/registerAdviser', userData);
      console.log(response.data); // Handle success response
      alert(`Adviser ${userData.username} is successfully registered.`);
      navigate('/account');
    } catch (error) {
      console.error('Error:', error); // Handle error
    }
  };

  // Define sections based on selected grade
  const renderSections = () => {
    const { grade } = userData;
    switch (grade) {
      case '7':
        return (
          <select
            id="section"
            name="section"
            value={userData.section}
            onChange={handleChange}
            required
          >
            <option value="">Select Section</option>
            <option value="Confidence">Confidence</option>
            <option value="Appreciation">Appreciation</option>
            {/* Add more options as needed */}
          </select>
        );
      case '8':
        return (
          <select
            id="section"
            name="section"
            value={userData.section}
            onChange={handleChange}
            required
          >
            <option value="">Select Section</option>
            <option value="Joy">Joy</option>
            <option value="Gratitude">Gratitude</option>
            {/* Add more options as needed */}
          </select>
        );
      case '9':
        return (
          <select
            id="section"
            name="section"
            value={userData.section}
            onChange={handleChange}
            required
          >
            <option value="">Select Section</option>
            <option value="Kindness">Happiness</option>
            <option value="Optimism">Greatness</option>
            {/* Add more options as needed */}
          </select>
        );
      case '10':
        return (
          <select
            id="section"
            name="section"
            value={userData.section}
            onChange={handleChange}
            required
          >
            <option value="">Select Section</option>
            <option value="Kindness">Kindness</option>
            <option value="Optimism">Optimism</option>
            {/* Add more options as needed */}
          </select>
        );
      default:
        return (
          <select
            id="section"
            name="section"
            value={userData.section}
            onChange={handleChange}
            required
            disabled
          >
            <option value="">Select Grade First</option>
          </select>
        );
    }
  };

  return (
    <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
        <div className={styles.sidenav}>
            <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']}/>
            {createSidebarLink("/report", "Report", AssessmentIcon)}
            {createSidebarLink("/account", "Account", AccountBoxIcon)}
            {createSidebarLink("/student", "Student", SchoolIcon)}
            {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
            {createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
            {createSidebarLink("/case", "Case", PostAddIcon)}
            {createSidebarLink("/pendings", "Pendings", PendingActionsIcon)}
            {createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
            <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
        </div>
      <div className={styles1.content}>
        <div className={styles1.contentform}>
          <h2>Register as Adviser</h2>
          <form onSubmit={handleSubmit} className={styles1['addadviser-form']}>
            <div className={styles1['form-container']}>
              <div className={styles1['form-group']}>
                <label htmlFor="username">Username:</label>
                <input 
                  type="text"
                  id="username"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                />
              </div>
              <div className={styles1['form-group']}>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>
              <div className={styles1['form-group']}>
                <label htmlFor="firstname">First Name:</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={userData.firstname}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
              </div>
              <div className={styles1['form-group']}>
                <label htmlFor="lastname">Last Name:</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={userData.lastname}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
              </div>
              <div className={styles1['form-group']}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>
              <div className={styles1['form-group']}>
                <label htmlFor="grade">Grade:</label>
                <select
                  id="grade"
                  name="grade"
                  value={userData.grade}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Grade</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <div className={styles1['form-group']}>
                <label htmlFor="section">Section:</label>
                {renderSections()}
              </div>
              <div className={styles1['form-group']}>
                  <label htmlFor="schoolYear">School Year:</label>
                  <select
                    id="schoolYear"
                    name="schoolYear"
                    value={userData.schoolYear}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select School Year</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                    <option value="2026-2027">2026-2027</option>
                    {/* Add more options as needed */}
                  </select>
              </div>                 
              <button type="submit" className={styles1['global-button']}>Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterAdviser;
