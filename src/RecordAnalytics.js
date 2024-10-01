import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import styles from './RecordAnalytics.module.css';

Chart.register(...registerables);

const RecordAnalytics = ({ records, schoolYears, grades }) => {
  const [sections, setSections] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

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

  // Move getRandomColor function above its usage
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
        if (selectedSchoolYear && record.student.schoolYear !== selectedSchoolYear) return false;
        if (selectedGrade && record.student.grade !== selectedGrade) return false;
        if (selectedSection && record.student.section !== selectedSection) return false;

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

      <div className={styles.chartWrapper}>
        <Line data={lineChartData} options={lineChartOptions} className={styles.chart} />
      </div>
    </div>
  );
};

export default RecordAnalytics;
