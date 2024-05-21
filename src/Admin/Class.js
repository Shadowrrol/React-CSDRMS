import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { Link } from 'react-router-dom';
import styles from '../Navigation.module.css';
import MenuPopupState from '../components/MenuPopupState';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AssessmentIcon from '@mui/icons-material/Assessment';

function Class() {
  const [classes, setClasses] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const [grades, setGrades] = useState([]);
  const [newGrade, setNewGrade] = useState('');
  const [newSection, setNewSection] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [newSchoolYear, setNewSchoolYear] = useState('');
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddSchoolYear, setShowAddSchoolYear] = useState(false);

  // Function to fetch all classes from backend
  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/class/getAllClasses');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  // Function to fetch all school years from backend
  const fetchSchoolYears = async () => {
    try {
      const response = await axios.get('http://localhost:8080/schoolYear/getAllSchoolYears');
      setSchoolYears(response.data);
    } catch (error) {
      console.error('Error fetching school years:', error);
    }
  };

  // Function to fetch all grades from backend
  const fetchGrades = async () => {
    try {
      const response = await axios.get('http://localhost:8080/class/allUniqueGrades');
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  // Function to add a new grade
  const addGrade = async () => {
    try {
      await axios.post('http://localhost:8080/class/addClass', { grade: newGrade, section: newSection });
      // Refresh the classes list after adding a new grade
      fetchClasses();
      setShowAddGrade(false); // Close the pop-up after adding the grade
    } catch (error) {
      console.error('Error adding grade:', error);
    }
  };

  // Function to add a new section
  const addSection = async () => {
    try {
      await axios.post('http://localhost:8080/class/addClass', { grade: selectedGrade, section: newSection });
      // Refresh the classes list after adding a new section
      fetchClasses();
      setShowAddSection(false); // Close the pop-up after adding the section
    } catch (error) {
      console.error('Error adding section:', error);
    }
  };

  // Function to add a new school year
  const addSchoolYear = async () => {
    try {
      await axios.post('http://localhost:8080/schoolYear/addSchoolYear', { schoolYear: newSchoolYear });
      // Refresh the school years list after adding a new school year
      fetchSchoolYears();
      setShowAddSchoolYear(false); // Close the pop-up after adding the school year
    } catch (error) {
      console.error('Error adding school year:', error);
    }
  };

  // Fetch classes, school years, and grades when the component mounts
  useEffect(() => {
    fetchClasses();
    fetchSchoolYears();
    fetchGrades();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']} />
        <Link to="/AdminDashboard" className={styles['styled-link']}>
          <AssessmentIcon className={styles.icon} />
          <span className={styles['link-text']}>Dashboard</span>
        </Link>
        <Link to="/account" className={styles['styled-link']}>
          <AccountBoxIcon className={styles.icon} />
          <span className={styles['link-text']}>Account</span>
        </Link>
        <Link to="/class" className={styles['styled-link']}>
          <MeetingRoomIcon className={styles.icon} />
          <span className={styles['link-text']}>Class</span>
        </Link>
        <MenuPopupState />
      </div>
      <div className={styles.mainContent}>
        <h2>Classes</h2>
        <ul>
          {classes.map((classItem) => (
            <li key={classItem.class_id}>
              Grade: {classItem.grade}, Section: {classItem.section}
            </li>
          ))}
        </ul>

        <h2>School Years</h2>
        <ul>
          {schoolYears.map((schoolYear) => (
            <li key={schoolYear.schoolYear_ID}>
              {schoolYear.schoolYear}
            </li>
          ))}
        </ul>

        {/* Add Grade Pop-up */}
        {showAddGrade && (
          <div className="popup">
            <div className="popup-content">
              <input
                type="number"
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                placeholder="Enter grade"
              />
              <input
                type="text"
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                placeholder="Enter section"
              />
              <button onClick={addGrade}>Add Grade</button>
              <button onClick={() => setShowAddGrade(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Add Section Pop-up */}
        {showAddSection && (
          <div className="popup">
            <div className="popup-content">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                <option value="">Select Grade</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
              <input
                type="text"
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                placeholder="Enter section"
              />
              <button onClick={addSection}>Add Section</button>
              <button onClick={() => setShowAddSection(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Add School Year Pop-up */}
        {showAddSchoolYear && (
          <div className="popup">
            <div className="popup-content">
              <input
                type="text"
                value={newSchoolYear}
                onChange={(e) => setNewSchoolYear(e.target.value)}
                placeholder="Enter school year"
              />
              <button onClick={addSchoolYear}>Add School Year</button>
              <button onClick={() => setShowAddSchoolYear(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Buttons to show pop-ups */}
        <div>
          <button onClick={() => setShowAddGrade(true)}>Add Grade</button>
          <button onClick={() => setShowAddSection(true)}>Add Section</button>
          <button onClick={() => setShowAddSchoolYear(true)}>Add School Year</button>
        </div>
      </div>
    </div>
  );
}

export default Class;
