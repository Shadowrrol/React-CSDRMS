import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from "./Login.module.css";
import { AuthContext } from './AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  useEffect(() => {
    document.title = "Login";
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const authTokenObj = JSON.parse(authToken);
        if (!authTokenObj) {
          navigate('/');
        } else {
          const { userType, userObject } = authTokenObj;
          switch (userType) {
            case 1:
            case 2:
            case 3:
              navigate('/report', { state: { userObject } });
              break;
            case 4:
              navigate('/AdminDashboard', { state: { userObject } });
              break;
            default:
              navigate('/');
          }
        }
      } catch (error) {
        console.error('Error parsing authToken:', error);
        navigate('/');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/user/login', {
        username,
        password,
      });

      if (!response.data.userType) {
        alert('Incorrect Username or Password');
        return;
      }

      const authTokenString = JSON.stringify(response.data);
      localStorage.setItem('authToken', authTokenString);

      

     

      const { userType, userObject } = response.data;
      login(response.data); // Update context

      console.log("User id: ",response.data.uid)
      const loginTime = new Date().toISOString(); // Get current time in ISO format
      await axios.post('http://localhost:8080/time-log/login', {
        userId: response.data.uid, // Assuming `userObject` contains `uid`
        loginTime: loginTime,
      });

      switch (userType) {
        case 1:
        case 2:
        case 3:
          navigate('/report', { state: { userObject } });
          break;
        case 4:
          navigate('/AdminDashboard', { state: { userObject } });
          break;
        default:
          alert('Incorrect Username or Password');
      }
    } catch (error) {
      console.error('Login Failed', error.response.data);
      alert('Incorrect Username or Password');
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
                    <input className={styles.frameItem} type="username" value={username} onChange={(e) => setUsername(e.target.value)} />
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
