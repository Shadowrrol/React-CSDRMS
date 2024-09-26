import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import navStyles from './Navigation.module.css';
import styles from './Record.module.css';
import axios from 'axios';

import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PostAddIcon from '@mui/icons-material/PostAdd';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

import CanvasJSReact from '@canvasjs/react-charts';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={navStyles['styled-link']}>
        <IconComponent className={navStyles.icon} />
        <span className={navStyles['link-text']}>{text}</span>
    </Link>
);

const Record = () => {
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = JSON.parse(authToken);
    const { section, schoolYear, userType, uid } = loggedInUser;
    const navigate = useNavigate();
    const [studentRecords, setStudentRecords] = useState([]);
    const [yearFilter, setYearFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const [gradeFilter, setGradeFilter] = useState('');
    const [chartType, setChartType] = useState("column");

    useEffect(() => {
        if (loggedInUser){
            document.title = loggedInUser.userType === 1 ? "SSO | Dashboard" :
                            loggedInUser.userType === 2 ? "Principal | Dashboard" :
                            loggedInUser.userType === 3 ? "Adviser | Dashboard" :
                            "Dashboard";
        
            const fetchStudentRecords = async () => {
                try {
                    const response = userType === 3
                        ? await axios.get(`http://localhost:8080/student-record/getStudentRecordsBySectionAndSchoolYear?section=${section}&schoolYear=${schoolYear}`)
                        : await axios.get('http://localhost:8080/student-record/getAllStudentRecords');
                    setStudentRecords(response.data);
                } catch (error) {
                    console.error('Error fetching student records:', error);
                }
            };

        fetchStudentRecords();
        }
    }, [section, schoolYear, userType, yearFilter, loggedInUser]);
    

    const handleLogout = async () => {
        console.log("userId:", uid);
        const logoutTime = new Date().toISOString();
      
        try {
          // Check if the userType is 3 before proceeding
          if (userType === 3) {
            // Fetch timeLogId using userId
            const response = await axios.get(`http://localhost:8080/time-log/getLatestLog/${uid}`);
            const { timelog_id: timelogId } = response.data; // Destructure timeLogId
      
            console.log("1: ", timelogId);
            console.log("2: ", logoutTime);
      
            // Send logout time to backend
            await axios.post('http://localhost:8080/time-log/logout', {
              timelogId, // Use timeLogId
              logoutTime,
            });
      
            console.log('Logout time logged successfully.');
          }
      
          // Clear tokens and navigate to login page regardless of userType
          localStorage.removeItem('authToken');
          navigate('/');
        } catch (error) {
          console.error('Error logging out', error);
        }
      };

    const filterStudentRecords = () => {
        return studentRecords.filter(record => {
            const matchesYear = yearFilter ? record.student.schoolYear === yearFilter : true;
            const matchesMonth = monthFilter ? record.date.includes(`-${monthFilter}-`) : true;
            const matchesGrade = gradeFilter ? record.student.grade === gradeFilter : true;

            return matchesYear && matchesMonth && matchesGrade;
        });
    };

    const filteredRecords = filterStudentRecords();

    const monitoredRecordCounts = filteredRecords.reduce((acc, record) => {
        const monitoredRecord = record.monitored_record;
        acc[monitoredRecord] = (acc[monitoredRecord] || 0) + 1;
        return acc;
    }, {});

    const chartOptions = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2",
        axisY: {
            includeZero: true
        },
        data: [{
            type: chartType,
            indexLabelFontColor: "#5A5757",
            indexLabelPlacement: "outside",
            dataPoints: Object.entries(monitoredRecordCounts).map(([label, y]) => ({ label, y }))
        }]
    };

    return (
        <div className={navStyles.wrapper}>
            <div className={navStyles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={navStyles['sidebar-logo']} />
                {createSidebarLink("/record", "Record", AssessmentIcon)}
                {loggedInUser.userType !== 2 && loggedInUser.userType !== 6 && createSidebarLink("/student", "Student", SchoolIcon)}
                {loggedInUser.userType !== 2 && loggedInUser.userType !== 6 && createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/report", "Report", PostAddIcon)}
                {loggedInUser.userType === 2 && createSidebarLink("/viewSuspensions", "Suspensions", LocalPoliceIcon)}
                {loggedInUser.userType === 1 && createSidebarLink("/timeLog", "Time Log", AccessTimeFilledIcon)}
                <button className={navStyles['logoutbtn']} onClick={handleLogout}>Logout</button>
            </div>
            <div className={navStyles.content}>
                <h1>Record Analytics</h1>
                    <div className={styles.filters}>
                    <h2>Filters:</h2>
                        {loggedInUser.userType !== 3 && (
                            <select onChange={e => setYearFilter(e.target.value)} value={yearFilter}>
                                <option value="">All Years</option>
                                <option value="2022-2023">2022-2023</option>
                                <option value="2023-2024">2023-2024</option>
                                <option value="2024-2025">2024-2025</option>
                            </select>
                        )}
                        <select onChange={e => setMonthFilter(e.target.value)} value={monthFilter}>
                            <option value="">All Months</option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                        {loggedInUser.userType !== 3 && (
                            <select onChange={e => setGradeFilter(parseInt(e.target.value, 10))} value={gradeFilter}>
                                <option value="">All Grades</option>
                                <option value="13">Grade 7</option>
                                <option value="14">Grade 8</option>
                                <option value="15">Grade 9</option>
                                <option value="16">Grade 10</option>
                            </select>
                        )}
                        <select onChange={e => setChartType(e.target.value)} value={chartType}>
                            <option value="column">Bar Graph</option>
                            <option value="line">Line Graph</option>
                            <option value="pie">Pie Chart</option>
                            <option value="area">Area Chart</option>
                        </select>
                </div>
                <div className={styles.chart}>
                    <CanvasJSChart options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default Record;
