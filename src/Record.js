import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecordTable from './RecordTable';
import RecordAnalytics from './RecordAnalytics';
import ViewStudentRecord from './ViewStudentRecord'; // Import the ViewRecord component
import recStyle from './Record.module.css'; // CSS for Record
import navStyles from './Navigation.module.css'; // CSS for Navigation
import Navigation from './Navigation'; // Import the Navigation component

const Record = () => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]); // State for students
  const [view, setView] = useState('table'); // Toggle view between table, analytics, and viewRecord
  const [loading, setLoading] = useState(false); // Loading state
  const [schoolYears, setSchoolYears] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    fetchRecords();
    fetchInitialData(); // Fetch both school years and grades in one go
    fetchStudents(); // Fetch students when component mounts
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

  const fetchStudents = async () => {
    try {
      const response = loggedInUser?.userType === 3
        ? await axios.get('http://localhost:8080/student/getAllStudentsByAdviser', {
            params: { section: loggedInUser.section, schoolYear: loggedInUser.schoolYear },
          })
        : await axios.get('http://localhost:8080/student/getAllCurrentStudents');

      setStudents(response.data); // Set students data
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const toggleView = () => {
    if (view === 'table') {
      setView('analytics');
    } else if (view === 'analytics') {
      setView('table');
    }
  };

  // New function to handle the 'View Record' button
  const handleViewRecord = () => {
    setView('viewRecord'); // Set view to 'viewRecord' when 'View Record' is clicked
  };

  return (
    <div className={navStyles['wrapper']}>
      <Navigation loggedInUser={loggedInUser} />

      {/* Main Content */}
      <div className={navStyles.content}>
        {loading ? (
          <p>Loading...</p>
        ) : view === 'table' ? (
          <RecordTable records={records} schoolYears={schoolYears} grades={grades} />
        ) : view === 'analytics' ? (
          <RecordAnalytics records={records} schoolYears={schoolYears} grades={grades} />
        ) : (
          // Pass the students as props to ViewStudentRecord
          <ViewStudentRecord
            loggedInUser={loggedInUser}
            schoolYears={schoolYears} // Pass schoolYears from Record.js
            grades={grades} // Pass grades from Record.js
            students={students} // Pass students from Record.js
            setStudents={setStudents} // Pass setStudents in case you need to update the state
          />
        )}

        {/* Button to toggle between table and analytics views */}
        <button className={recStyle.switchViewButton} onClick={toggleView}>
          {view === 'table' ? 'Switch to Analytics' : 'Switch to Table'}
        </button>

        {/* New Button to display ViewRecord component */}
        <button className={recStyle.viewRecordButton} onClick={handleViewRecord}>
          View Record
        </button>
      </div>
    </div>
  );
};

export default Record;
