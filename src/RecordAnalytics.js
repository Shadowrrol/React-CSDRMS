import React, { useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2'; // Import Bar and Pie components
import { Chart, registerables } from 'chart.js';
import styles from './Record.module.css';
import RecordFilter from './RecordFilter'; // Importing the RecordFilter component

Chart.register(...registerables);

const RecordAnalytics = ({ records, schoolYears, grades }) => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;

  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(loggedInUser?.userType === 3 ? loggedInUser.grade : '');
  const [selectedSection, setSelectedSection] = useState(loggedInUser?.userType === 3 ? loggedInUser.section : '');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [chartType, setChartType] = useState('line'); // New state to control the chart type

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

  // Function to count records for each category by day or month
  const countRecordsByDayOrMonth = (dayOrMonth, category, isMonthView = false) => {
    return records.filter((record) => {
      if (loggedInUser?.userType !== 3 && selectedSchoolYear && record.student.schoolYear !== selectedSchoolYear) return false;
      if (selectedGrade && record.student.grade !== selectedGrade) return false;
      if (selectedSection && record.student.section !== selectedSection) return false;

      const recordDate = new Date(record.record_date);
      const recordMonth = String(recordDate.getMonth() + 1).padStart(2, '0');
      const recordWeek = Math.ceil(recordDate.getDate() / 7);
      if (isMonthView) {
        if (selectedWeek && recordWeek !== parseInt(selectedWeek, 10)) return false;
        return recordMonth === dayOrMonth && record.monitored_record === category;
      } else {
        const recordDay = recordDate.getDate();
        if (selectedWeek && recordWeek !== parseInt(selectedWeek, 10)) return false;
        return recordDay === dayOrMonth && recordMonth === selectedMonth && record.monitored_record === category;
      }
    }).length;
  };

  const categories = ['Absent', 'Tardy', 'Cutting Classes', 'Improper Uniform', 'Offense', 'Misbehavior', 'Clinic', 'Sanction'];
  const isAllMonthsSelected = selectedMonth === '';
  let lineLabels = [];
  let lineDatasets = [];

  const rainbowColors = [
    '#FF0000', // Red
    '#FF7F00', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#8B00FF', // Violet
    '#000000', // Black for the 8th category
  ];

  if (isAllMonthsSelected) {
    lineLabels = months.map((month) => month.label);
    lineDatasets = categories.map((category, index) => ({
      label: category,
      data: months.map((month) => countRecordsByDayOrMonth(month.value, category, true)),
      borderColor: rainbowColors[index], // Use rainbow colors for line chart
      backgroundColor: 'rgba(0, 0, 0, 0)',
      tension: 0.4,
    }));
  } else {
    const daysInSelectedMonth = new Date(2024, parseInt(selectedMonth, 10), 0).getDate();
    lineLabels = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);
    lineDatasets = categories.map((category, index) => ({
      label: category,
      data: Array.from({ length: daysInSelectedMonth }, (_, i) => countRecordsByDayOrMonth(i + 1, category)),
      borderColor: rainbowColors[index], // Use rainbow colors for line chart
      backgroundColor: 'rgba(0, 0, 0, 0)',
      tension: 0.4,
    }));
  }

  // Pie chart data - sum the records by category based on selected filters
  const getPieData = () => {
    const filteredData = categories.map((category) =>
      records.filter((record) => {
        if (loggedInUser?.userType !== 3 && selectedSchoolYear && record.student.schoolYear !== selectedSchoolYear) return false;
        if (selectedGrade && record.student.grade !== selectedGrade) return false;
        if (selectedSection && record.student.section !== selectedSection) return false;

        const recordDate = new Date(record.record_date);
        const recordMonth = String(recordDate.getMonth() + 1).padStart(2, '0');
        const recordWeek = Math.ceil(recordDate.getDate() / 7);
        
        const isInSelectedMonth = isAllMonthsSelected || recordMonth === selectedMonth;
        const isInSelectedWeek = !selectedWeek || recordWeek === parseInt(selectedWeek, 10);
        
        return isInSelectedMonth && isInSelectedWeek && record.monitored_record === category;
      }).length
    );

    return {
      labels: categories,
      datasets: [
        {
          data: filteredData,
          backgroundColor: rainbowColors, // Use rainbow colors array
          borderWidth: 1,
        },
      ],
    };
  };

  const pieData = getPieData();

  // Bar chart data - group categories and sum their counts per month or day
  const barLabels = isAllMonthsSelected ? months.map((month) => month.label) : Array.from({ length: 31 }, (_, i) => i + 1);
  const barDatasets = categories.map((category, index) => ({
    label: category,
    data: isAllMonthsSelected
      ? months.map((month) => countRecordsByDayOrMonth(month.value, category, true))
      : Array.from({ length: 31 }, (_, i) => countRecordsByDayOrMonth(i + 1, category)),
    backgroundColor: rainbowColors[index], // Use rainbow colors array
  }));

  const lineChartData = {
    labels: lineLabels,
    datasets: lineDatasets,
  };

  const barChartData = {
    labels: barLabels,
    datasets: barDatasets,
  };

  // Line Chart Options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: isAllMonthsSelected
          ? 'Monitored Records by Month (Line Chart)'
          : `Monitored Records for ${months.find((m) => m.value === selectedMonth)?.label || ''} (Line Chart)`,
      },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        title: { display: true, text: 'Frequency' },
        ticks: {
          callback: function(value) {
            return Number.isInteger(value) ? value : ''; // Show integer values only
          },
        },
      },      
      x: { title: { display: true, text: isAllMonthsSelected ? 'Months' : 'Days of the Month' } },
    },
  };

  // Pie Chart Options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Distribution of Monitored Records by Category (Pie Chart)',
      },
    },
    // No need to specify scales for the pie chart
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: isAllMonthsSelected
          ? 'Monitored Records by Category (Bar Chart)'
          : `Monitored Records for ${months.find((m) => m.value === selectedMonth)?.label || ''} (Bar Chart)`,
      },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        title: { display: true, text: 'Frequency' },
        ticks: {
          callback: function(value) {
            return Number.isInteger(value) ? value : ''; // Show integer values only
          },
        },
      },
      x: { title: { display: true, text: isAllMonthsSelected ? 'Months' : 'Days of the Month' } },
    },
  };

  // Conditionally render the chart based on selected chart type
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={barChartData} options={barChartOptions} className={styles.chart} />;
      case 'pie':
        return <Pie data={pieData} options={pieChartOptions} className={styles.chart} />;
      default:
        return <Line data={lineChartData} options={lineChartOptions} className={styles.chart} />;
    }
  };

  return (
    <>
      <h2 className={styles.RecordTitle}> Analytics Overview</h2> 
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
        chartType={chartType} // Pass chartType state to the RecordFilter component
        setChartType={setChartType} // Pass setChartType to change chart type
        isAnalytics={true} // Pass true to show chart type dropdown
      />

      <div className={styles.chartWrapper}>
        {renderChart()}
      </div>
    </>
  );
};

export default RecordAnalytics;
