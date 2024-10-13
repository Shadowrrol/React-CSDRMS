import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const RecordAnalytics = () => {
  const authToken = localStorage.getItem("authToken");
  const loggedInUser = authToken ? JSON.parse(authToken) : null;
  
  const [chartData, setChartData] = useState(null);
  const [schoolYears, setSchoolYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [records, setRecords] = useState([]);

  const isAdviser = loggedInUser && loggedInUser.userType === 3;

  useEffect(() => {
    fetchSchoolYears();
    fetchClasses();
    fetchStudentRecords();
  }, []);

  const fetchSchoolYears = async () => {
    try {
      const response = await axios.get('http://localhost:8080/schoolYear/getAllSchoolYears');
      setSchoolYears(response.data);
    } catch (error) {
      console.error('Error fetching school years:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/class/getAllClasses');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchStudentRecords = async () => {
    try {
      let response;
      if (isAdviser) {
        // Fetch records by adviser using the user's grade, section, and school year
        response = await axios.get('http://localhost:8080/student-record/getStudentRecordsByAdviser', {
          params: {
            grade: loggedInUser.grade,
            section: loggedInUser.section,
            schoolYear: loggedInUser.schoolYear
          }
        });
        setSelectedClass(classes.find(cls => cls.grade === loggedInUser.grade && cls.section === loggedInUser.section));
      } else {
        // Fetch all student records
        response = await axios.get('http://localhost:8080/student-record/getAllStudentRecords');
      }
      
      setRecords(response.data);
      if (response.data.length > 0) {
        processData(response.data, selectedSchoolYear, selectedClass, selectedMonth, selectedWeek);
      }
    } catch (error) {
      console.error('Error fetching student records:', error);
    }
  };
  
  const processData = (records, schoolYear, classFilter, monthFilter, weekFilter) => {
    const months = ['August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May'];
    const daysInMonth = (month) => new Date(2023, month + 1, 0).getDate();
    const monitoredRecords = ['Absent', 'Tardy', 'Cutting Classes', 'Improper Uniform', 'Offense', 'Misbehavior', 'Clinic'];
    const frequency = {};
    const sanctionCount = new Array(31).fill(0);

    monitoredRecords.forEach(type => {
      frequency[type] = new Array(monthFilter ? daysInMonth(monthFilter) : 10).fill(0);
    });

    records.forEach(record => {
      const recordDate = new Date(record.record_date);
      const month = recordDate.getMonth();
      const year = record.student.schoolYear;
      const grade = record.student.grade;
      const section = record.student.section;

      if ((schoolYear && year !== schoolYear) || 
          (classFilter && (grade !== classFilter.grade || section !== classFilter.section)) ||
          (monthFilter && month !== monthFilter)) return;

      const day = recordDate.getDate() - 1;
      const week = Math.floor(day / 7);

      if (monthFilter) {
        if (weekFilter !== '' && week !== parseInt(weekFilter)) return;

        const monitoredType = record.monitored_record;
        if (frequency[monitoredType]) {
          frequency[monitoredType][day]++;
        }
        if (record.sanction && record.sanction.trim() !== '') {
          sanctionCount[day]++;
        }
      } else if (month >= 7 || month <= 4) {
        const monthIndex = (month >= 7) ? month - 7 : month + 5;
        const monitoredType = record.monitored_record;

        if (frequency[monitoredType]) {
          frequency[monitoredType][monthIndex]++;
        }

        if (record.sanction && record.sanction.trim() !== '') {
          sanctionCount[monthIndex]++;
        }
      }
    });

    const chartData = {
      labels: monthFilter ? Array.from({ length: daysInMonth(monthFilter) }, (_, i) => i + 1) : months,
      datasets: [
        ...monitoredRecords.map((type, index) => ({
          label: type,
          data: frequency[type],
          borderColor: getColor(index),
          fill: false,
          tension: 0.1
        })),
        {
          label: 'Sanctions',
          data: sanctionCount,
          borderColor: 'rgba(255, 99, 71, 1)',
          fill: false,
          tension: 0.1
        }
      ]
    };

    setChartData(chartData);
  };

  const getColor = (index) => {
    const colors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(199, 199, 199, 1)'
    ];
    return colors[index % colors.length];
  };

  const handleSchoolYearChange = (event) => {
    const newSchoolYear = event.target.value;
    setSelectedSchoolYear(newSchoolYear);
    processData(records, newSchoolYear, selectedClass, selectedMonth, selectedWeek);
  };

  const handleClassChange = (event) => {
    const classId = event.target.value;
    const selectedClass = classes.find(cls => cls.class_id === parseInt(classId));
    setSelectedClass(selectedClass);
    processData(records, selectedSchoolYear, selectedClass, selectedMonth, selectedWeek);
  };

  const handleMonthChange = (event) => {
    const month = event.target.value === '' ? '' : parseInt(event.target.value);
    setSelectedMonth(month);
    setSelectedWeek(''); // Reset week when month changes
    processData(records, selectedSchoolYear, selectedClass, month, ''); // Pass empty string for week
};


  const handleWeekChange = (event) => {
    const week = event.target.value;
    setSelectedWeek(week);
    processData(records, selectedSchoolYear, selectedClass, selectedMonth, week);
  };

  if (!chartData) {
    return <p>Loading data...</p>;
  }

  return (
    <div>
      <h2>Monitored Record Analytics</h2>
      {!isAdviser && (
        <>
          <label htmlFor="schoolYearSelect">Select School Year:</label>
          <select id="schoolYearSelect" value={selectedSchoolYear} onChange={handleSchoolYearChange}>
            <option value="">All School Years</option>
            {schoolYears.map((year) => (
              <option key={year.id} value={year.schoolYear}>{year.schoolYear}</option>
            ))}
          </select>
        </>
      )}
      
      <label htmlFor="classSelect">Select Class:</label>
      <select id="classSelect" value={isAdviser ? `${loggedInUser.grade} - ${loggedInUser.section}` : (selectedClass?.class_id || '')} onChange={handleClassChange} disabled={isAdviser}>
        {isAdviser ? (
          <option value={`${loggedInUser.grade} - ${loggedInUser.section}`}>
            {`${loggedInUser.grade} - ${loggedInUser.section}`}
          </option>
        ) : (
          <option value="">All Classes</option>
        )}
        {classes.map((cls) => (
          <option key={cls.class_id} value={cls.class_id}>{`${cls.grade} - ${cls.section}`}</option>
        ))}
      </select>
      <label htmlFor="monthSelect">Select Month:</label>
      <select id="monthSelect" value={selectedMonth || ''} onChange={handleMonthChange}>
        <option value="">All Months</option>
        <option value="7">August</option>
        <option value="8">September</option>
        <option value="9">October</option>
        <option value="10">November</option>
        <option value="11">December</option>
        <option value="0">January</option>
        <option value="1">February</option>
        <option value="2">March</option>
        <option value="3">April</option>
        <option value="4">May</option>
      </select>

      {selectedMonth && (
        <>
          <label htmlFor="weekSelect">Select Week:</label>
          <select id="weekSelect" value={selectedWeek} onChange={handleWeekChange}>
            <option value="">All Weeks</option>
            <option value="0">Week 1</option>
            <option value="1">Week 2</option>
            <option value="2">Week 3</option>
            <option value="3">Week 4</option>
            <option value="4">Week 5</option>
          </select>
        </>
      )}

      <Line data={chartData} options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: selectedMonth ? (selectedWeek !== '' ? 'Days in Week' : 'Days') : 'Months'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Frequency'
            },
            beginAtZero: true
          }
        }
      }} />
    </div>
  );
};

export default RecordAnalytics;
