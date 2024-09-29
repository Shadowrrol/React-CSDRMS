import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import styles from './RecordAnalytics.module.css'; // Importing CSS module

// Register all chart components globally
Chart.register(...registerables);

const RecordAnalytics = ({ records }) => {
  const months = [
    { value: '08', label: 'August' },
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

  const [schoolYears, setSchoolYears] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  useEffect(() => {
    fetchSchoolYears();
    fetchGrades();
  }, []);

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

  const fetchSectionsByGrade = async (grade) => {
    try {
      const response = await axios.get(`http://localhost:8080/class/sections/${grade}`);
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

  // Function to count frequency per day or month, filtered by school year, grade, section, and month
  const countRecordsByDayAndCategory = (dayOrMonth, category, isMonthView = false) => {
    return records
      .filter((record) => {
        // Filter by school year
        if (selectedSchoolYear && record.student.schoolYear !== selectedSchoolYear) {
          return false;
        }
        // Filter by grade
        if (selectedGrade && record.student.grade !== selectedGrade) {
          return false;
        }
        // Filter by section
        if (selectedSection && record.student.section !== selectedSection) {
          return false;
        }
        const recordDate = new Date(record.record_date);
        const recordMonth = String(recordDate.getMonth() + 1).padStart(2, '0');
        if (isMonthView) {
          return recordMonth === dayOrMonth && record.monitored_record === category;
        } else {
          const recordDay = recordDate.getDate();
          return recordDay === dayOrMonth && recordMonth === selectedMonth && record.monitored_record === category;
        }
      })
      .length;
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

  const isAllMonthsSelected = selectedMonth === ''; // Check if "All Months" is selected
  let labels = [];
  let datasets = [];

  if (isAllMonthsSelected) {
    // If "All Months" is selected, show the months on the x-axis
    labels = months.map((month) => month.label);
    datasets = categories.map((category) => ({
      label: category,
      data: months.map((month) => countRecordsByDayAndCategory(month.value, category, true)),
      borderColor: getRandomColor(),
      backgroundColor: 'rgba(0, 0, 0, 0)',
      tension: 0.4,
      fill: false,
    }));
  } else {
    // If a specific month is selected, show the days of that month on the x-axis
    const daysInSelectedMonth = getDaysInMonth(2024, parseInt(selectedMonth, 10));
    labels = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1); // Days of the month
    datasets = categories.map((category) => ({
      label: category,
      data: Array.from({ length: daysInSelectedMonth }, (_, i) => countRecordsByDayAndCategory(i + 1, category)),
      borderColor: getRandomColor(),
      backgroundColor: 'rgba(0, 0, 0, 0)',
      tension: 0.4,
      fill: false,
    }));
  }

  const lineChartData = {
    labels,
    datasets,
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: isAllMonthsSelected
          ? 'Monitored Records by Month'
          : `Monitored Records for ${months.find((m) => m.value === selectedMonth)?.label || ''}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Frequency',
        },
      },
      x: {
        title: {
          display: true,
          text: isAllMonthsSelected ? 'Months' : 'Days of the Month',
        },
      },
    },
  };

  return (
    <div className={styles.analyticsWrapper}>
      <h2 className={styles.analyticsTitle}>Analytics Overview</h2>

      {/* Dropdown to filter by school year */}
      <div className={styles.filterContainer}>
        <label htmlFor="schoolYearFilter">Filter by School Year:</label>
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
      </div>

      {/* Dropdown to filter by grade */}
      <div className={styles.filterContainer}>
        <label htmlFor="gradeFilter">Filter by Grade:</label>
        <select
          id="gradeFilter"
          value={selectedGrade}
          onChange={(e) => {
            setSelectedGrade(e.target.value);
            setSelectedSection(''); // Reset section when grade changes
            fetchSectionsByGrade(e.target.value); // Fetch sections for selected grade
          }}
        >
          <option value="">All Grades</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown to filter by section */}
      {selectedGrade && (
        <div className={styles.filterContainer}>
          <label htmlFor="sectionFilter">Filter by Section:</label>
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
        </div>
      )}

      {/* Dropdown to filter by month */}
      <div className={styles.filterContainer}>
        <label htmlFor="monthFilter">Filter by Month:</label>
        <select
          id="monthFilter"
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
      </div>

      {/* Line chart displaying records */}
      <div className={styles.chartWrapper}>
        <Line data={lineChartData} options={lineChartOptions} className={styles.chart} />
      </div>
    </div>
  );
};

export default RecordAnalytics;
