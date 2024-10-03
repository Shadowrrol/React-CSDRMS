import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecordTable from './RecordTable';
import RecordAnalytics from './RecordAnalytics';
import recStyle from './Record.module.css'; // CSS for Record
import navStyles from './Navigation.module.css'; // CSS for Navigation
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
    <div className={navStyles['wrapper']}>
      <Navigation loggedInUser={loggedInUser} />

      {/* Main Content */}
      <div className={navStyles.content}>
        {loading ? <p>Loading...</p> : view === 'table' ? (
          <RecordTable records={records} schoolYears={schoolYears} grades={grades} />
        ) : (
          <RecordAnalytics records={records} schoolYears={schoolYears} grades={grades} />
        )}

        <button className={recStyle.switchViewButton} onClick={toggleView}>
          {view === 'table' ? 'Switch to Analytics' : 'Switch to Table'}
        </button>
        
      </div>  
    </div>
  );
};

export default Record;
