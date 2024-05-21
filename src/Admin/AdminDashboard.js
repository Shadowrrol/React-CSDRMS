import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import axios from 'axios';
import styles from '../Navigation.module.css';

import MenuPopupState from '../components/MenuPopupState';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AssessmentIcon from '@mui/icons-material/Assessment';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/allUsers');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    document.title = "SSO | Dashboard";
    fetchUsers();
  }, []);

  const handleUpdateUser = (user) => {
    navigate(`/UpdateAccount`, { state: { user } }); // Navigate to UpdateAccount with user state
  };

  const deleteUser = async (username) => {
    try {
      await axios.delete(`http://localhost:8080/user/deleteUser/${username}`);
      // Refresh the user list after deleting a user
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
      <div className={styles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']} />
        <Link to="/AdminDashboard" className={styles['styled-link']}>
          <AssessmentIcon className={styles.icon} />
          <span className={styles['link-text']}>Dashboard</span>
        </Link>
        <Link to="/account" className={styles['styled-link']}>
          <AccountBoxIcon className={styles.icon} />
          <span className={styles['link-text']}>Account</span>
        </Link>
        <Link to="/class" className={styles['styled-link']}>
          <MeetingRoomIcon className={styles.icon} />
          <span className={styles['link-text']}>Class</span>
        </Link>
        <MenuPopupState />
      </div>
      <div className='content'>
        <h1>All Users</h1>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>User Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.username}>
                <td>{user.username}</td>
                <td>{user.userType}</td>
                <td>
                  <button onClick={() => handleUpdateUser(user)}>Update</button> {/* Use onClick event to trigger navigation */}
                  <button onClick={() => deleteUser(user.username)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
