import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Navigation.module.css';
import styles1 from '../GlobalForm.module.css';
import MenuPopupState from '../components/MenuPopupState';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AssessmentIcon from '@mui/icons-material/Assessment';

const createSidebarLink = (to, text, IconComponent) => (
  <Link to={to} className={styles['styled-link']}>
      <IconComponent className={styles.icon} />
      <span className={styles['link-text']}>{text}</span>
  </Link>
);

const RegisterAdviser = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    uid: '',
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: '',
    grade: '',
    section: '',
    schoolYear: '',
    userType: 3
  });
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Admin | Register Adviser";
    // Fetch grades
    axios.get('http://localhost:8080/class/allUniqueGrades')
      .then(response => {
        setGrades(response.data);
      })
      .catch(error => {
        console.error('Error fetching grades:', error);
      });

    // Fetch school years
    axios.get('http://localhost:8080/schoolYear/getAllSchoolYears')
      .then(response => {
        setSchoolYears(response.data.map(year => year.schoolYear));
      })
      .catch(error => {
        console.error('Error fetching school years:', error);
      });
  }, []);

  const handleGradeChange = (e) => {
    const grade = e.target.value;
    setUserData({ ...userData, grade, section: '', schoolYear: '' });
    // Fetch sections based on selected grade
    axios.get(`http://localhost:8080/class/sections/${grade}`)
      .then(response => {
        setSections(response.data);
      })
      .catch(error => {
        console.error('Error fetching sections:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/user/registerAdviser', userData);
      console.log(response.data);
      setMessage('Adviser is successfully registered.');
      setError('');
      setTimeout(() => {
        navigate('/account');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setMessage('');
      alert('Username already exist. Please try again.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="Logo" className={styles['sidebar-logo']} />
        {createSidebarLink("/AdminDashboard", "Dashboard", AssessmentIcon)}
        {createSidebarLink("/account", "Account", AccountBoxIcon)}
        {createSidebarLink("/class", "Class", MeetingRoomIcon)}
        <MenuPopupState />
      </div>
      <div className={styles1.content}>
        <div className={styles1.contentform}>
          <h2>Register as Adviser</h2>
          <form onSubmit={handleSubmit} className={styles1['addadviser-form']}>
            {message && <p className={styles1.success}>{message}</p>}
            {error && <p className={styles1.error}>{error}</p>}
            <div className={styles1['form-container']}>
              <div className={styles1['form-group']}>
                <label htmlFor="username">Username:</label>
                <input 
                  type="text"
                  id="username"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                />
              </div>
              <div className={styles1['form-group']}>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>
              <div className={styles1['form-group']}>
                <label htmlFor="firstname">First Name:</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={userData.firstname}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
              </div>
              <div className={styles1['form-group']}>
                <label htmlFor="lastname">Last Name:</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={userData.lastname}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
              </div>
              <div className={styles1['form-group']}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>
              <div className={styles1['form-group']}>
                <label htmlFor="grade">Grade:</label>
                <select
                  id="grade"
                  name="grade"
                  value={userData.grade}
                  onChange={handleGradeChange}
                  required
                >
                  <option value="">Select Grade</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>Grade {grade}</option>
                  ))}
                </select>
              </div>
              <div className={styles1['form-group']}>
                <label htmlFor="section">Section:</label>
                <select
                  id="section"
                  name="section"
                  value={userData.section}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Section</option>
                  {sections.map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>
              <div className={styles1['form-group']}>
                  <label htmlFor="schoolYear">School Year:</label>
                  <select
                    id="schoolYear"
                    name="schoolYear"
                    value={userData.schoolYear}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select School Year</option>
                    {schoolYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
              </div>                 
              <button type="submit" className={styles1['global-button']}>Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterAdviser;
