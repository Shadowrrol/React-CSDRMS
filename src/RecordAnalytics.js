import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import styles from './Record.module.css';
import RecordFilter from './RecordFilter'; // Importing the new RecordFilter component

Chart.register(...registerables);

const RecordAnalytics = ({ records, schoolYears, grades }) => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;

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
      />

      <div className={styles.chartWrapper}>
        <Line data={lineChartData} options={lineChartOptions} className={styles.chart} />
      </div>
    </>
  );
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default RecordAnalytics;
