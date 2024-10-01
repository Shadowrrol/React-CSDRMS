import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecordTable from './RecordTable';
import RecordAnalytics from './RecordAnalytics';
import styles2 from './Record.module.css'; // CSS for Record
import styles from './Navigation.module.css'; // CSS for Navigation

import AssessmentIcon from '@mui/icons-material/Assessment';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

const Record = () => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;
  const [records, setRecords] = useState([]);
  const [view, setView] = useState('table'); // Toggle view between table and analytics
  const [loading, setLoading] = useState(false); // Loading state
  const [schoolYears, setSchoolYears] = useState([]);
  const [grades, setGrades] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRecords();
    fetchSchoolYears();
    fetchGrades();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = loggedInUser?.userType === 3 
        ? await axios.get(`http://localhost:8080/student-record/getStudentRecordsBySectionAndSchoolYear?section=${loggedInUser.section}&schoolYear=${loggedInUser.schoolYear}`)
        : await axios.get('http://localhost:8080/student-record/getAllStudentRecords');
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolYears = async () => {
    try {
      const response = await axios.get('http://localhost:8080/schoolYear/getAllSchoolYears');
      setSchoolYears(response.data);
    } catch (error) {
      console.error('Error fetching school years:', error);
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await axios.get('http://localhost:8080/class/allUniqueGrades');
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const toggleView = () => {
    setView(view === 'table' ? 'analytics' : 'table');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={styles['styled-link']}>
      <IconComponent className={styles.icon} />
      <span className={styles['link-text']}>{text}</span>
    </Link>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="Logo" className={styles['sidebar-logo']} />
        {createSidebarLink("/record", "Record", AssessmentIcon)}
        {loggedInUser.userType !== 2 && loggedInUser.userType !== 6 && createSidebarLink("/student", "Student", SchoolIcon)}
        {loggedInUser.userType !== 2 && loggedInUser.userType !== 6 && createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
        {loggedInUser.userType !== 2 && createSidebarLink("/report", "Report", PostAddIcon)}
        {loggedInUser.userType === 2 && createSidebarLink("/viewSuspensions", "Suspensions", LocalPoliceIcon)}
        {loggedInUser.userType === 1 && createSidebarLink("/timeLog", "Time Log", AccessTimeFilledIcon)}
        <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
      </div>
      <div>
        <h1 className={styles2.recordTitle}>Student Records</h1>
        <button className={styles2.switchViewButton} onClick={toggleView}>
          {view === 'table' ? 'Switch to Analytics' : 'Switch to Table'}
        </button>

        {loading ? <p>Loading...</p> : view === 'table' ? (
          <RecordTable records={records} schoolYears={schoolYears} grades={grades} />
        ) : (
          <RecordAnalytics records={records} schoolYears={schoolYears} grades={grades} />
        )}
      </div>
    </div>
  );
};

export default Record;
