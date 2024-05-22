import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import navStyles from '../Navigation.module.css';
import styles from './admindashboard.module.css';
import MenuPopupState from '../components/MenuPopupState';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AssessmentIcon from '@mui/icons-material/Assessment';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/allUsers');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "SSO | Dashboard";
    fetchUsers();
  }, []);

  const handleUpdateUser = (user) => {
    navigate(`/UpdateAccount`, { state: { user } });
  };

  const deleteUser = async (username) => {
    try {
      await axios.delete(`http://localhost:8080/user/deleteUser/${username}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={navStyles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
      <div className={navStyles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="" className={navStyles['sidebar-logo']} />
        <Link to="/AdminDashboard" className={navStyles['styled-link']}>
          <AssessmentIcon className={navStyles.icon} />
          <span className={navStyles['link-text']}>Dashboard</span>
        </Link>
        <Link to="/account" className={navStyles['styled-link']}>
          <AccountBoxIcon className={navStyles.icon} />
          <span className={navStyles['link-text']}>Account</span>
        </Link>
        <Link to="/class" className={navStyles['styled-link']}>
          <MeetingRoomIcon className={navStyles.icon} />
          <span className={navStyles['link-text']}>Class</span>
        </Link>
        <MenuPopupState />
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <h1 className={styles.h2}>All Users</h1>
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
                  <td className={styles['action-buttons']}>
                    <button className={styles.button} onClick={() => handleUpdateUser(user)}>Update</button>
                    <button className={styles.button} onClick={() => deleteUser(user.username)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
