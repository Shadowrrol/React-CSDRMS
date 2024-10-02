import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import navStyles from '../Navigation.module.css';
import styles from './AdminDashboard.module.css';
import JHSLogo from '../image-sso-yellow.png';
/*import SearchIcon from '@mui/icons-material/Search';*/
import SchoolIcon from '@mui/icons-material/School';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Logout from '@mui/icons-material/Logout';
import AddUserModal from './AddUserModal';  
import ConfirmationModal from './ConfirmationModal';  
import UpdateAccountModal from './UpdateAccountModal'; 

// Function to create a sidebar link with an icon
const createSidebarLink = (to, text, IconComponent) => (
  <Link to={to} className={navStyles['styled-link']} key={to}>
    <IconComponent className={navStyles.icon} />
    <span>{text}</span>
  </Link>
);

const AdminDashboard = () => {
  // State variables
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isUpdateAccountModalOpen, setIsUpdateAccountModalOpen] = useState(false);
  
  useEffect(() => {
    if (!authToken || !loggedInUser) {
      navigate('/login');
      return;
    }

    document.title = "Admin | Dashboard";
    fetchUsers();
  }, [authToken, loggedInUser, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/allUsers');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setConfirmationMessage(`Are you sure you want to delete the user "${selectedUser.username}"?`);
      setIsConfirmationModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        await axios.delete(`http://localhost:8080/user/deleteUser/${selectedUser.username}`);
        setUsers(prevUsers => prevUsers.filter(user => user.username !== selectedUser.username));
        setSelectedUser(null);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUpdateUser = () => {
    if (selectedUser) {
      setIsUpdateAccountModalOpen(true);
    }
  };

  const handleAddUser = () => setIsAddUserModalOpen(true);

  const refreshUsers = () => fetchUsers();

  const filteredUsers = useMemo(() => users.filter(user => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const usernameMatches = user.username.toLowerCase().includes(lowerCaseQuery);
    const nameMatches = `${user.firstname} ${user.lastname}`.toLowerCase().includes(lowerCaseQuery);
    const emailMatches = user.email.toLowerCase().includes(lowerCaseQuery);
    const userTypeMatches = user.userType.toString().includes(lowerCaseQuery);

    return usernameMatches || nameMatches || emailMatches || userTypeMatches;
  }), [users, searchQuery]);

  return (
    <div className={navStyles.wrapper}>
      {/* Sidebar */}
      <div className={navStyles.sidenav}>
        <div className={navStyles['sidenav-title']}>MENU</div>
        {createSidebarLink("/AdminDashboard", "Dashboard", AccountBoxIcon)}
        {createSidebarLink("/class", "Class", SchoolIcon)}
        {/* Removed the logout button from the sidebar */}
      </div>

      {/* Main Content */}
      <div className={navStyles.content}>
        {/* Header */}
        <header className={navStyles.header}>
          {/* App Logo & Title */}     
          <div className={navStyles.JHSheaderContainer}>
            <img src={JHSLogo} alt="JHS Logo" className={navStyles.JHSLogo} />
            <span className={navStyles.JHSTitle}>JHS Success Hub</span>
          </div>
          {/* Logout Button */}
          <button className={navStyles.logoutbtn} onClick={handleLogout}>
            <Logout />
          </button>
        </header>

        {/* Page title */}
        <h1 className={navStyles['admin-dashboard-title']}>User Management</h1>
        <div className={styles['user-center-container']}>
          <div className={styles['table-container']}>
            <table className={styles['user-table']}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>User Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr
                      key={user.username}
                      onClick={() => setSelectedUser(user)}
                      className={selectedUser?.username === user.username ? styles['selected-row'] : ''}
                    >
                      <td>{user.username}</td>
                      <td>{`${user.firstname} ${user.lastname}`}</td>
                      <td>{user.email}</td>
                      <td>{user.userType}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className={styles['no-results']} style={{ textAlign: 'center', fontSize: '1.5rem' }}>
                      No Results Found...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons and Search */}
        <div className={styles['action-buttons']}>
          <button
            className={`${styles['action-btn']} ${styles['admin-add-btn']}`}
            onClick={handleAddUser}
          >
            Add
          </button>
          <button
            className={`${styles['action-btn']} ${styles['edit-btn']}`}
            onClick={handleUpdateUser}
            disabled={!selectedUser}
          >
            Edit
          </button>
          <button
            className={`${styles['action-btn']} ${styles['delete-btn']}`}
            onClick={handleDeleteUser}
            disabled={!selectedUser}
          >
            Delete
          </button>
          
          <div className={styles['filter-search-bar']}>
            <input
              type="search"
              className={styles['searchRec']}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Users..."
            />
          </div>          
        </div>
      </div>

      {/* Modals */}
      <AddUserModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmDelete}
        message={confirmationMessage}
      />
      <UpdateAccountModal
        isOpen={isUpdateAccountModalOpen}
        onClose={() => {
          setIsUpdateAccountModalOpen(false);
          refreshUsers();
        }}
        user={selectedUser}
        onUpdateSuccess={refreshUsers}
      />
    </div>
  );
};

export default AdminDashboard;
