import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Record.module.css'; // Importing CSS module
import tableStyles from './GlobalTable.module.css'; // Importing global table styles
import RecordFilter from './RecordFilter'; // Importing the new RecordFilter component

const RecordTable = ({ records, schoolYears, grades }) => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;
  
  const [sections, setSections] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(loggedInUser?.userType === 3 ? loggedInUser.grade : '');
  const [selectedSection, setSelectedSection] = useState(loggedInUser?.userType === 3 ? loggedInUser.section : '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedGrade) {
      fetchSectionsByGrade(selectedGrade);
    }
  }, [selectedGrade]);

  const fetchSectionsByGrade = async (grade) => {
    try {
      const response = await axios.get(`http://localhost:8080/class/sections/${grade}`);
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const getWeekNumber = (date) => {
    const dayOfMonth = date.getDate();
    return Math.ceil(dayOfMonth / 7);
  };

  const countFrequency = (entity, category, isSection = false) => {
    return records
      .filter((record) => {
        if (selectedSchoolYear && record.student.schoolYear !== selectedSchoolYear) {
          return false;
        }
        if (isSection) {
          return record.student.section === entity && record.monitored_record === category;
        } else {
          return record.student.grade === entity && record.monitored_record === category;
        }
      })
      .filter((record) => {
        if (selectedMonth) {
          const recordMonth = new Date(record.record_date).getMonth() + 1;
          return recordMonth === parseInt(selectedMonth, 10);
        }
        return true;
      })
      .filter((record) => {
        if (selectedWeek) {
          const recordDate = new Date(record.record_date);
          const weekNumber = getWeekNumber(recordDate);
          return weekNumber === parseInt(selectedWeek, 10);
        }
        return true;
      }).length;
  };

  const calculateTotalForCategory = (category, isSection = false) => {
    const entities = isSection ? sections : grades;
    return entities.reduce((total, entity) => total + countFrequency(entity, category, isSection), 0);
  };

  const categories = [
    'Absent',
    'Tardy',
    'Cutting Classes',
    'Improper Uniform',
    'Offense',
    'Misbehavior',
    'Clinic',
    'Sanction',
  ];

  return (
    <>
      <div className={styles.TitleContainer}>
        <div className={styles['h1-title']}>Student Records</div>
        <h2 className={styles.RecordTitle}> - Table Overview</h2> 
      </div>

      {/* Using RecordFilter to handle all filter logic */}
      <RecordFilter
        schoolYears={schoolYears}
        grades={grades}
        loggedInUser={loggedInUser}
        selectedSchoolYear={selectedSchoolYear}
        setSelectedSchoolYear={setSelectedSchoolYear}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}  
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
      />

      {loading ? (
        <p>Loading records...</p>
      ) : selectedGrade ? (
        <table className={tableStyles['global-table']}>
          <thead>
            <tr>
              <th>Grade</th>
              <th>Section</th>
              {categories.map((category) => (
                <th key={category}>{category}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections
              .filter(section => !selectedSection || section === selectedSection) // Filter by selected section
              .map((section) => (
                <tr key={section}>
                  <td>{selectedGrade}</td>
                  <td>{section}</td>
                  {categories.map((category) => (
                    <td key={category}>{countFrequency(section, category, true)}</td>
                  ))}
                </tr>
              ))}
            <tr>
              <td colSpan="2" style={{ fontWeight: 'bold' }}>Total</td>
              {categories.map((category) => (
                <td key={category} style={{ fontWeight: 'bold' }}>
                  {calculateTotalForCategory(category, true)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      ) : (
        <table className={tableStyles['global-table']}>
          <thead>
            <tr>
              <th>Grade</th>
              {categories.map((category) => (
                <th key={category}>{category}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade}>
                <td>{grade}</td>
                {categories.map((category) => (
                  <td key={category}>{countFrequency(grade, category)}</td>
                ))}
              </tr>
            ))} 
            <tr>
              <td>Total</td>
              {categories.map((category) => (
                <td key={category} style={{ fontWeight: 'bold' }}>
                  {calculateTotalForCategory(category)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};

export default RecordTable;
