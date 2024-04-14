import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check userType and redirect if user is already logged in
    if (loggedIn && userInfo) {
      redirectToDashboard(userInfo.userType);
    }
  }, [loggedIn, userInfo]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username !== '' && password !== '') {
      try {
        const response = await fetch('http://localhost:8080/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const userData = await response.json();
          setUserInfo(userData);
          setLoggedIn(true);
        } else {
          alert('Login failed. Please check your credentials.');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred. Please try again later.');
      }
    } else {
      alert('Please enter username and password');
    }
  };

  const redirectToDashboard = (userType) => {
    switch (userType) {
      case 0:
        navigate('/AdminDashboard', { state: { userInfo } });
        break;
      case 1:
        navigate('/SSO_Dashboard', { state: { userInfo } });
        break;
      case 2:
        navigate('/PrincipalDashboard', { state: { userInfo } });
        break;
      case 3:
        navigate('/AdviserDashboard', { state: { userInfo } });
        break;
      default:
        console.error('Invalid userType:', userType);
    }
  };

  return (
    <div>
      {loggedIn ? (
        <div>
          <h1>Welcome, {userInfo ? `${userInfo.firstname} ${userInfo.lastname}` : 'User'}!</h1>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
