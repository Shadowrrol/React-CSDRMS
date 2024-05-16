import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateAccount = () => {
  const [loggedInUserType, setLoggedInUserType] = useState(null);
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = JSON.parse(authToken);
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
    <div>
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
  );
};

export default UpdateAccount;
