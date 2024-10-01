import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './RecordTable.module.css'; // Importing CSS module

const RecordTable = ({ records, schoolYears, grades }) => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;
  
  const [sections, setSections] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(loggedInUser?.userType === 3 ? loggedInUser.grade : ''); // Automatically set grade for userType 3
  const [loading, setLoading] = useState(false);

  const months = [
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
  ];

  const weeks = [
    { value: '1', label: 'Week 1' },
    { value: '2', label: 'Week 2' },
    { value: '3', label: 'Week 3' },
    { value: '4', label: 'Week 4' },
  ];

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

  // Helper function to calculate total for a category
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
    <div className={styles.tableWrapper}>
      <h2 className={styles.tableTitle}>Records</h2>

      {/* Filters */}
      <div className={styles.filterContainer}>
        {/* Hide school year filter for userType === 3 */}
        {loggedInUser?.userType !== 3 && (
          <>
            <label htmlFor="schoolYearFilter" className={styles.filterLabel}>Filter by School Year: </label>
            <select
              id="schoolYearFilter"
              value={selectedSchoolYear}
              onChange={(e) => setSelectedSchoolYear(e.target.value)}
            >
              <option value="">All School Years</option>
              {schoolYears.map((schoolYear) => (
                <option key={schoolYear.schoolYear_ID} value={schoolYear.schoolYear}>
                  {schoolYear.schoolYear}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Grade filter, disabled for userType 3 */}
        <label htmlFor="gradeFilter" className={styles.filterLabel} style={{ marginLeft: '20px' }}>Filter by Grade: </label>
        <select
          id="gradeFilter"
          value={selectedGrade}
          onChange={(e) => {
            setSelectedGrade(e.target.value);
            setSections([]); // Reset sections when grade changes
            fetchSectionsByGrade(e.target.value);
          }}
          disabled={loggedInUser?.userType === 3} // Disable the grade filter for userType 3
        >
          <option value="">All Grades</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>

        <label htmlFor="monthFilter" className={styles.filterLabel} style={{ marginLeft: '20px' }}>Filter by Month: </label>
        <select
          id="monthFilter"
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            setSelectedWeek(''); // Reset week filter when month changes
          }}
        >
          <option value="">All Months</option>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>

        {selectedMonth && (
          <>
            <label htmlFor="weekFilter" className={styles.filterLabel} style={{ marginLeft: '20px' }}>Filter by Week: </label>
            <select
              id="weekFilter"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
            >
              <option value="">All Weeks</option>
              {weeks.map((week) => (
                <option key={week.value} value={week.value}>
                  {week.label}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {loading ? (
        <p>Loading records...</p>
      ) : selectedGrade ? (
        <table className={styles.table}>
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
            {sections.map((section) => (
              <tr key={section}>
                <td>{selectedGrade}</td>
                <td>{section}</td>
                {categories.map((category) => (
                  <td key={category}>
                    {countFrequency(section, category, true)}
                  </td>
                ))}
              </tr>
            ))}
            {/* Total row for sections */}
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
        <table className={styles.table}>
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
                  <td key={category}>
                    {countFrequency(grade, category)}
                  </td>
                ))}
              </tr>
            ))}
            {/* Total row for grades */}
            <tr>
              <td style={{ fontWeight: 'bold' }}>Total</td>
              {categories.map((category) => (
                <td key={category} style={{ fontWeight: 'bold' }}>
                  {calculateTotalForCategory(category)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecordTable;
