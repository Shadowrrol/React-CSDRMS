import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import styles from './RecordAnalytics.module.css';

Chart.register(...registerables);

const RecordAnalytics = ({ records, schoolYears, grades }) => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;
  
  const [sections, setSections] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(loggedInUser?.userType === 3 ? loggedInUser.grade : '');
  const [selectedSection, setSelectedSection] = useState(loggedInUser?.userType === 3 ? loggedInUser.section : '');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');

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

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const countRecordsByDayOrMonth = (dayOrMonth, category, isMonthView = false) => {
    return records
      .filter((record) => {
        if (loggedInUser?.userType !== 3 && selectedSchoolYear && record.student.schoolYear !== selectedSchoolYear) return false;
        if (selectedGrade && record.student.grade !== selectedGrade) return false;
        if (selectedSection && record.student.section !== selectedSection) return false;

        const recordDate = new Date(record.record_date);
        const recordMonth = String(recordDate.getMonth() + 1).padStart(2, '0');
        const recordWeek = Math.ceil(recordDate.getDate() / 7);  // Calculate week based on the day of the month
        if (isMonthView) {
          if (selectedWeek && recordWeek !== parseInt(selectedWeek, 10)) return false;
          return recordMonth === dayOrMonth && record.monitored_record === category;
        } else {
          const recordDay = recordDate.getDate();
          if (selectedWeek && recordWeek !== parseInt(selectedWeek, 10)) return false;
          return recordDay === dayOrMonth && recordMonth === selectedMonth && record.monitored_record === category;
        }
      })
      .length;
  };

  const categories = ['Absent', 'Tardy', 'Cutting Classes', 'Improper Uniform', 'Offense', 'Misbehavior', 'Clinic', 'Sanction'];
  const isAllMonthsSelected = selectedMonth === '';
  let labels = [];
  let datasets = [];

  if (isAllMonthsSelected) {
    labels = months.map((month) => month.label);
    datasets = categories.map((category) => ({
      label: category,
      data: months.map((month) => countRecordsByDayOrMonth(month.value, category, true)),
      borderColor: getRandomColor(),
      backgroundColor: 'rgba(0, 0, 0, 0)',
      tension: 0.4,
    }));
  } else {
    const daysInSelectedMonth = new Date(2024, parseInt(selectedMonth, 10), 0).getDate();
    labels = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);
    datasets = categories.map((category) => ({
      label: category,
      data: Array.from({ length: daysInSelectedMonth }, (_, i) => countRecordsByDayOrMonth(i + 1, category)),
      borderColor: getRandomColor(),
      backgroundColor: 'rgba(0, 0, 0, 0)',
      tension: 0.4,
    }));
  }

  const lineChartData = {
    labels,
    datasets,
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: isAllMonthsSelected ? 'Monitored Records by Month' : `Monitored Records for ${months.find((m) => m.value === selectedMonth)?.label || ''}` },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Frequency' } },
      x: { title: { display: true, text: isAllMonthsSelected ? 'Months' : 'Days of the Month' } },
    },
  };

  return (
    <div className={styles.analyticsWrapper}>
      <h2 className={styles.analyticsTitle}>Analytics Overview</h2>

      <div className={styles.filterContainer}>
        {/* Hide school year filter for userType 3 */}
        {loggedInUser?.userType !== 3 && (
          <>
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
          </>
        )}
      </div>

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
          disabled={loggedInUser?.userType === 3} // Disable grade filter for userType 3
        >
          <option value="">All Grades</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
      </div>

      {selectedGrade && (
        <div className={styles.filterContainer}>
          <label htmlFor="sectionFilter">Filter by Section:</label>
          <select
            id="sectionFilter"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            disabled={loggedInUser?.userType === 3} // Disable section filter for userType 3
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

      <div className={styles.filterContainer}>
        <label htmlFor="monthFilter">Filter by Month:</label>
        <select
          id="monthFilter"
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            setSelectedWeek(''); // Reset week when month changes
          }}
        >
          <option value="">All Months</option>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      {selectedMonth && (
        <div className={styles.filterContainer}>
          <label htmlFor="weekFilter">Filter by Week:</label>
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
        </div>
      )}

      <div className={styles.chartWrapper}>
        <Line data={lineChartData} options={lineChartOptions} className={styles.chart} />
      </div>
    </div>
  );
};

export default RecordAnalytics;
