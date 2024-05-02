import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from "./Login.module.css";

const LoginPage = () => {
  // Initialize the navigate hook
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
   
  
    if (authToken) {
      try {
        // Attempt to parse the authTokenString
        const authTokenObj = JSON.parse(authToken);
       
        const userType = authTokenObj?.userType;
        if (!authTokenObj) {
          // If the authentication token is still not available, navigate to the login page
          navigate('/');
        } else {
          // If the authentication token exists, navigate based on user type and pass userObject as state
          if (userType === 1) {
            const userObject = authTokenObj;
            navigate('/SSO_Dashboard', { state: { userObject } });
          } else if (userType === 2) {
            const userObject = authTokenObj;
            navigate('/PrincipalDashboard', { state: { userObject } });
          } else if (userType === 3) {
            const userObject = authTokenObj;
            navigate('/AdviserDashboard', { state: { userObject } });
          } else {
            // Handle unexpected userType
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error parsing authToken:', error);
        // Handle error if parsing fails, for example, navigate to the login page
        navigate('/');
      }
    } else {
      // If the authentication token doesn't exist, navigate to the login page
      navigate('/');
    }
  }, [navigate]);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:8080/user/login', {
        username,
        password,
      });
  
      if (!response.data.userType) {
        setError('Incorrect Username or Password');
        return;
      }
  
      const authTokenString = JSON.stringify(response.data);
      localStorage.setItem('authToken', authTokenString);
  
      const userType = response.data.userType;
      const userObject = response.data;

  
      if (userType === 1) {
        navigate('/SSO_Dashboard', { state: { userObject } });
      } else if (userType === 2) {
        navigate('/PrincipalDashboard', { state: { userObject } });
      } else if (userType === 3) {
        navigate('/AdviserDashboard', { state: { userObject } });
      } else {
        setError('Incorrect Username or Password');
      }
  
    } catch (error) {
      console.error('Login Failed', error.response.data);
      setError('Incorrect Username or Password');
    }
  };
  return (
    <div>
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
                  <div className={styles.frameParent}>
                    <div className={styles.usernameParent}>
                      <div className={styles.username}>Username</div>
                      <input className={styles.frameItem} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className={styles.passwordParent}>
                      <div className={styles.password}>Password</div>
                      <input className={styles.frameInner} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className={styles.frameContainer}>
                      <button type="submit" className={styles.inputParent}>
                        <div className={styles.input} />
                        <div className={styles.login1}>Login</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </form>
    </div>
  );
};

export default LoginPage;
