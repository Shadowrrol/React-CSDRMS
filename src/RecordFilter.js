import React, { useEffect, useState } from 'react';
import styles from './Record.module.css'; // Importing CSS module
import axios from 'axios';

const RecordFilter = ({
  schoolYears,
  grades,
  loggedInUser,
  selectedSchoolYear,
  setSelectedSchoolYear,
  selectedGrade,
  setSelectedGrade,
  selectedSection,
  setSelectedSection,
  selectedMonth,
  setSelectedMonth,
  selectedWeek,
  setSelectedWeek
}) => {
  const [sections, setSections] = useState([]);

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

  const fetchSectionsByGrade = async (grade) => {
    try {
      const response = await axios.get(`http://localhost:8080/class/sections/${grade}`);
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  useEffect(() => {
    if (selectedGrade) {
      fetchSectionsByGrade(selectedGrade);
    } else {
      setSections([]); // Reset sections if no grade is selected
    }
  }, [selectedGrade]);

  return (
    <div className={styles.filterContainer}>
      <label>Filters: </label>

      {loggedInUser?.userType !== 3 && (
        <select
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
      )}

      <select
        value={selectedGrade}
        onChange={(e) => {
          setSelectedGrade(e.target.value);
          setSelectedSection(''); // Reset section when grade changes
          fetchSectionsByGrade(e.target.value); // Fetch sections for selected grade
        }}
        disabled={loggedInUser?.userType === 3} // Disable for logged-in users who are restricted to a specific grade
      >
        <option value="">All Grades</option>
        {grades.map((grade) => (
          <option key={grade} value={grade}>
            {grade}
          </option>
        ))}
      </select>

      {selectedGrade && (
        <select
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
      )}

      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        <option value="">All Months</option>
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>

      <select
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
    </div>
  );
};

export default RecordFilter;
