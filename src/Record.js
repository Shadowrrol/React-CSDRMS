import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecordTable from './RecordTable';
import RecordAnalytics from './RecordAnalytics';
import styles2 from './Record.module.css'; // CSS for Record
import Navigation from './Navigation'; // Import the Navigation component

const Record = () => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;
  const [records, setRecords] = useState([]);
  const [view, setView] = useState('table'); // Toggle view between table and analytics
  const [loading, setLoading] = useState(false); // Loading state
  const [schoolYears, setSchoolYears] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    fetchRecords();
    fetchInitialData(); // Fetch both school years and grades in one go
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

  const fetchInitialData = async () => {
    try {
      const [schoolYearResponse, gradeResponse] = await Promise.all([
        axios.get('http://localhost:8080/schoolYear/getAllSchoolYears'),
        axios.get('http://localhost:8080/class/allUniqueGrades')
      ]);
      setSchoolYears(schoolYearResponse.data);
      setGrades(gradeResponse.data);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const toggleView = () => {
    setView(view === 'table' ? 'analytics' : 'table');
  };

  return (
    <div>
      {/* Call the Navigation component and pass the loggedInUser */}
      <Navigation loggedInUser={loggedInUser} />

      {/* Page title */}
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
  );
};

export default Record;
