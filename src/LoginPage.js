import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./Login.module.css";

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
     <div className={styles.login}>
      <section className={styles.image23Parent}>
        <img className={styles.image23} alt="" src="/image-2-3@2x.png" />
        <div className={styles.imageRemovebgPreview33Wrapper}>
          <img
            className={styles.imageRemovebgPreview33}
            loading="lazy"
            alt=""
            src="/imageremovebgpreview-3-3@2x.png"
          />
        </div>
        <div className={styles.rectangleParent}>
          <div className={styles.frameChild} />
          <img
            className={styles.n1Icon}
            loading="lazy"
            alt=""
            src="/362026522-800031278575304-8187898021528936793-n-1@2x.png"
          />
          <div className={styles.frameWrapper}>
            <form className={styles.frameParent}>
              <div className={styles.usernameParent}>
                <div className={styles.username}>Username</div>
                <input className={styles.frameItem} type="text" value={username}
              onChange={(e) => setUsername(e.target.value)}/>
              </div>
              <div className={styles.passwordParent}>
                <div className={styles.password}>Password</div>
                <input className={styles.frameInner} type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}/>
              </div>
              <div className={styles.frameContainer}>
                <button type="submit" className={styles.inputParent}>
                  <div className={styles.input} />
                  <div className={styles.login1}>Login</div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
    </form>
      )}
    </div>
  );
};

export default LoginPage;
