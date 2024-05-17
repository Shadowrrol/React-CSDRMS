import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Navigation.module.css';
import styles1 from './GlobalForm.module.css';

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

const UpdateAccount = () => {
  const [loggedInUserType, setLoggedInUserType] = useState(null);
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = JSON.parse(authToken);
  const navigate = useNavigate();
  const [updatedUser, setUpdatedUser] = useState({
    // Initialize with empty values for all fields
    username: loggedInUser.username,
    password: '',
    firstname: loggedInUser.firstname,
    lastname: loggedInUser.lastname,
    email: loggedInUser.email,
    userType: loggedInUser.userType,
    schoolYear: loggedInUser.schoolYear || '',
    grade: loggedInUser.grade || null,
    section: loggedInUser.section || ''
  });
  
  const handleLogout = () => {
    // Clear the authentication token from localStorage
    localStorage.removeItem('authToken');
    // Redirect the user to the login page
    navigate('/');
  };

  useEffect(() => {
    if (loggedInUser) {
      setLoggedInUserType(loggedInUser.userType);
    }
  }, [loggedInUser]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleUpdate = () => {
    switch (loggedInUserType) {
      case 1:
        axios.put('http://localhost:8080/user/updateSSO', updatedUser)
          .then(response => {
            console.log(response.data);
            // Handle success, e.g., show success message
          })
          .catch(error => {
            console.error('Error updating SSO:', error);
            // Handle error, e.g., show error message
          });
        break;
      case 2:
        axios.put('http://localhost:8080/user/updatePrincipal', updatedUser)
          .then(response => {
            console.log(response.data);
            // Handle success, e.g., show success message
          })
          .catch(error => {
            console.error('Error updating Principal:', error);
            // Handle error, e.g., show error message
          });
        break;
      case 3:
        axios.put('http://localhost:8080/user/updateAdviser', updatedUser)
          .then(response => {
            console.log(response.data);
            // Handle success, e.g., show success message
          })
          .catch(error => {
            console.error('Error updating Adviser:', error);
            // Handle error, e.g., show error message
          });
        break;
      default:
        // Handle default case
        break;
    }
  };

  return (
    <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
      <div className={styles.sidenav}>
          <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']}/>
          {createSidebarLink("/report", "Report", AssessmentIcon)}
          {loggedInUser.userType !== 2 && loggedInUser.userType !== 3 && createSidebarLink("/account", "Account", AccountBoxIcon)}
          {loggedInUser.userType !== 2 && createSidebarLink("/student", "Student", SchoolIcon)}
          {loggedInUser.userType !== 2 && createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
          {loggedInUser.userType !== 2 && createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
          {loggedInUser.userType !== 2 && createSidebarLink("/case", "Case", PostAddIcon)}
          {loggedInUser.userType !== 3 && createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
          {loggedInUser.userType !== 2 && createSidebarLink("/Followup", "Followups", PendingActionsIcon)}
           <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
      </div>         
      <div className={styles1.content}>
        <div className={styles1.contentform}>
          <h2>Update Account</h2>
          <div>
            <label>Username:</label>
            <input type="text" name="username" value={updatedUser.username} onChange={handleInputChange} disabled/>
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" value={updatedUser.password} onChange={handleInputChange} />
          </div>
          <div>
            <label>First Name:</label>
            <input type="text" name="firstname" value={updatedUser.firstname} onChange={handleInputChange} />
          </div>
          <div>
            <label>Last Name:</label>
            <input type="text" name="lastname" value={updatedUser.lastname} onChange={handleInputChange} />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={updatedUser.email} onChange={handleInputChange} />
          </div>
          {loggedInUserType === 3 && (
            <div>
              <label>School Year:</label>
              <input type="text" name="schoolYear" value={updatedUser.schoolYear} onChange={handleInputChange} />
              <label>Grade:</label>
              <input type="number" name="grade" value={updatedUser.grade} onChange={handleInputChange} />
              <label>Section:</label>
              <input type="text" name="section" value={updatedUser.section} onChange={handleInputChange} />
            </div>
          )}
          <button onClick={handleUpdate}>Update Account</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAccount;
