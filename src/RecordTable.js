import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './RecordTable.module.css'; // Importing CSS module

const RecordTable = () => {
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [records, setRecords] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(''); // State for selected grade
  const [loading, setLoading] = useState(true);

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
    fetchRecords();
    fetchSchoolYears();
    fetchGrades();
  }, []);

  // Fetch records
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const recordsResponse = await axios.get('http://localhost:8080/student-record/getAllStudentRecords');
      setRecords(recordsResponse.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all available school years
  const fetchSchoolYears = async () => {
    try {
      const response = await axios.get('http://localhost:8080/schoolYear/getAllSchoolYears');
      setSchoolYears(response.data);
    } catch (error) {
      console.error('Error fetching school years:', error);
    }
  };

  // Fetch all unique grades
  const fetchGrades = async () => {
    try {
      const response = await axios.get('http://localhost:8080/class/allUniqueGrades');
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  // Fetch sections based on the selected grade
  const fetchSectionsByGrade = async (grade) => {
    try {
      const response = await axios.get(`http://localhost:8080/class/sections/${grade}`);
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  // Function to count the frequency of each category per grade or section, with filters applied
  const countFrequency = (entity, category, isSection = false) => {
    return records
      .filter((record) => {
        // Filter by school year
        if (selectedSchoolYear && record.student.schoolYear !== selectedSchoolYear) {
          return false;
        }
        // Filter by grade or section
        if (isSection) {
          return record.student.section === entity && record.monitored_record === category;
        }
        return record.student.grade === entity && record.monitored_record === category;
      })
      .filter((record) => {
        // Filter by month
        if (selectedMonth) {
          const recordMonth = new Date(record.record_date).getMonth() + 1;
          return recordMonth === parseInt(selectedMonth, 10);
        }
        return true;
      })
      .filter((record) => {
        // Filter by week
        if (selectedWeek) {
          const recordDate = new Date(record.record_date);
          const weekNumber = Math.ceil(recordDate.getDate() / 7); // Calculate the week number (1-4)
          return weekNumber === parseInt(selectedWeek, 10);
        }
        return true;
      }).length;
  };

  // Function to calculate the total occurrences for each category
  const calculateTotalForCategory = (category) => {
    return records
      .filter((record) => record.monitored_record === category)
      .filter((record) => {
        // Apply filters: school year, month, and week
        if (selectedSchoolYear && record.student.schoolYear !== selectedSchoolYear) {
          return false;
        }
        if (selectedMonth) {
          const recordMonth = new Date(record.record_date).getMonth() + 1;
          return recordMonth === parseInt(selectedMonth, 10);
        }
        if (selectedWeek) {
          const recordDate = new Date(record.record_date);
          const weekNumber = Math.ceil(recordDate.getDate() / 7);
          return weekNumber === parseInt(selectedWeek, 10);
        }
        return true;
      }).length;
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

      {/* Dropdown to select the school year */}
      <div className={styles.filterContainer}>
        <label htmlFor="schoolYearFilter">Filter by School Year: </label>
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

        {/* Dropdown to select the grade */}
        <label htmlFor="gradeFilter" style={{ marginLeft: '20px' }}>Filter by Grade: </label>
        <select
          id="gradeFilter"
          value={selectedGrade}
          onChange={(e) => {
            setSelectedGrade(e.target.value);
            setSections([]); // Reset sections when grade changes
            fetchSectionsByGrade(e.target.value); // Fetch sections based on selected grade
          }}
        >
          <option value="">All Grades</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>

        {/* Dropdown to select the month */}
        <label htmlFor="monthFilter" style={{ marginLeft: '20px' }}>Filter by Month: </label>
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

        {/* Conditionally render the week filter if a month is selected */}
        {selectedMonth && (
          <>
            <label htmlFor="weekFilter" style={{ marginLeft: '20px' }}>Filter by Week: </label>
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
          </tbody>
          {/* Only display total if no specific grade is selected */}
          <tfoot>
            <tr>
              <td>Total</td>
              {categories.map((category) => (
                <td key={category}>{calculateTotalForCategory(category)}</td>
              ))}
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

export default RecordTable;
