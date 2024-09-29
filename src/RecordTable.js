import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './RecordTable.module.css'; // Importing CSS module

const RecordTable = () => {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const [grades, setGrades] = useState([]); // State for grades
  const [sections, setSections] = useState([]); // State for sections
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(''); // State for selected grade
  const [selectedSection, setSelectedSection] = useState(''); // State for selected section
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
    fetchStudentsWithRecords();
    fetchSchoolYears();
    fetchGrades(); // Fetch grades when the component mounts
  }, []);

  // Fetch students and records in parallel
  const fetchStudentsWithRecords = async () => {
    setLoading(true);
    try {
      const [studentsResponse, recordsResponse] = await Promise.all([
        axios.get('http://localhost:8080/student/getAllStudents'),
        axios.get('http://localhost:8080/student-record/getAllStudentRecords'),
      ]);

      setStudents(studentsResponse.data);
      setRecords(recordsResponse.data);
    } catch (error) {
      console.error('Error fetching students or records:', error);
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

  // Function to count the frequency of each category per student, with month and week filtering
  const countFrequency = (studentId, category) => {
    return records
      .filter((record) => record.id === studentId && record.monitored_record === category)
      .filter((record) => {
        if (!selectedMonth) return true; // No month filter, return all
        const recordMonth = new Date(record.record_date).getMonth() + 1;
        return recordMonth === parseInt(selectedMonth, 10);
      })
      .filter((record) => {
        if (!selectedWeek) return true; // No week filter, return all
        const recordDate = new Date(record.record_date);
        const weekNumber = Math.ceil(recordDate.getDate() / 7); // Calculate the week number (1-4)
        return weekNumber === parseInt(selectedWeek, 10);
      }).length;
  };

  // Assuming you have a set of categories to monitor
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

  // Filter students based on the selected school year, grade, and section
  const filteredStudents = students.filter((student) => {
    return (
      (!selectedSchoolYear || student.schoolYear === selectedSchoolYear) &&
      (!selectedGrade || student.grade === selectedGrade) &&
      (!selectedSection || student.section === selectedSection)
    );
  });

  return (
    <div className={styles.tableWrapper}>
      <h2 className={styles.tableTitle}>Students and Their Records</h2>

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
            setSelectedSection(''); // Reset section when grade changes
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

        {/* Dropdown to select the section (shows when a grade is selected) */}
        {selectedGrade && (
          <>
            <label htmlFor="sectionFilter" style={{ marginLeft: '20px' }}>Filter by Section: </label>
            <select
              id="sectionFilter"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="">All Sections</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </>
        )}

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
        <p>Loading students and records...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Full Name</th>
              <th>SY</th>
              {categories.map((category) => (
                <th key={category}>{category}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.sid}</td>
                <td>{student.name}</td>
                <td>{student.schoolYear}</td>
                {categories.map((category) => (
                  <td key={category}>
                    {countFrequency(student.id, category)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecordTable;
