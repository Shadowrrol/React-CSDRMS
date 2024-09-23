import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import navStyles from '../Navigation.module.css';
import styles from './AdminDashboard.module.css';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AssessmentIcon from '@mui/icons-material/Assessment';
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
  const navigate = useNavigate(); // Hook to programmatically navigate
  const authToken = localStorage.getItem('authToken'); // Get auth token from localStorage
  const loggedInUser = authToken ? JSON.parse(authToken) : null; // Parse logged in user from token

  const [users, setUsers] = useState([]); // State to store user data
  const [selectedUser, setSelectedUser] = useState(null); // State to store the currently selected user
  const [searchQuery, setSearchQuery] = useState(''); // State to manage search input
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false); // State to control visibility of the add user modal
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // State to control visibility of the confirmation modal
  const [confirmationMessage, setConfirmationMessage] = useState(''); // State to hold confirmation message
  const [isUpdateAccountModalOpen, setIsUpdateAccountModalOpen] = useState(false); // State to control visibility of the update account modal

  // Effect to set the document title, validate token, and fetch users on component mount
  useEffect(() => {
    // If no authToken is found, redirect to login page
    if (!authToken || !loggedInUser) {
      navigate('/login');
      return;
    }

    document.title = "Admin | Dashboard";
    fetchUsers(); // Fetch the user list
  }, [authToken, loggedInUser, navigate]);

  // Function to fetch users from the server
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/allUsers');
      setUsers(response.data); // Set fetched users to state
    } catch (error) {
      console.error('Error fetching users:', error); // Log any errors
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove auth token
    navigate('/'); // Redirect to the login page
  };

  // Function to handle user deletion
  const handleDeleteUser = () => {
    if (selectedUser) {
      setConfirmationMessage(`Are you sure you want to delete the user "${selectedUser.username}"?`);
      setIsConfirmationModalOpen(true); // Open the confirmation modal
    }
  };

  // Function to confirm deletion of a user
  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        await axios.delete(`http://localhost:8080/user/deleteUser/${selectedUser.username}`);
        setUsers(prevUsers => prevUsers.filter(user => user.username !== selectedUser.username)); // Remove deleted user from the list
        setSelectedUser(null); // Deselect user after deletion
      } catch (error) {
        console.error('Error deleting user:', error); // Log any errors
      }
    }
  };

  // Function to handle updating a user
  const handleUpdateUser = () => {
    if (selectedUser) {
      setIsUpdateAccountModalOpen(true); // Open the update account modal
    }
  };

  // Function to handle opening the add user modal
  const handleAddUser = () => setIsAddUserModalOpen(true);

  // Function to refresh the user list
  const refreshUsers = () => fetchUsers();

  // Memoized filtered user list based on search query
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
      <div className={navStyles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="logo" className={navStyles['sidebar-logo']} />
        {createSidebarLink("/AdminDashboard", "Dashboard", AssessmentIcon)}
        {createSidebarLink("/class", "Class", MeetingRoomIcon)}
        <button className={navStyles.logoutbtn} onClick={handleLogout}>Logout</button>
      </div>

      <div className={navStyles.content}>
        <h1>User Management</h1>
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
                      No Results Found
                    </td>
                  </tr>                
                )}
              </tbody>
          </table>
        </div>

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
              placeholder="Search by Username, Name, Email or User Type"
            />
          </div>
        </div>
      </div>

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
          refreshUsers(); // Refresh the user list after updating
        }}
        user={selectedUser}
        onUpdateSuccess={refreshUsers} // Pass the refresh function to the modal
      />
    </div>
  );
};

export default AdminDashboard;
