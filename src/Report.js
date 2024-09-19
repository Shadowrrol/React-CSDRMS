import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Navigation.module.css';
import axios from 'axios';

import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

import CanvasJSReact from '@canvasjs/react-charts';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={styles['styled-link']}>
        <IconComponent className={styles.icon} />
        <span className={styles['link-text']}>{text}</span>
    </Link>
);

const Report = () => {
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = JSON.parse(authToken);
    const { section, schoolYear, userType, uid } = loggedInUser;
    const navigate = useNavigate();
    const [studentReports, setStudentReports] = useState([]);
    const [yearFilter, setYearFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const [gradeFilter, setGradeFilter] = useState('');
    const [chartType, setChartType] = useState("column");

    useEffect(() => {
        document.title = "Report";
        const fetchStudentReports = async () => {
            try {
                const response = userType === 3
                    ? await axios.get(`http://localhost:8080/student-report/getStudentReportsBySectionAndSchoolYear?section=${section}&schoolYear=${schoolYear}`)
                    : await axios.get('http://localhost:8080/student-report/getAllStudentReports');
                setStudentReports(response.data);
            } catch (error) {
                console.error('Error fetching student reports:', error);
            }
        };

        fetchStudentReports();
    }, [section, schoolYear, userType, yearFilter]);

    const handleLogout = async () => {
        console.log("userId:",uid)
        const logoutTime = new Date().toISOString();
        try {
            // Fetch timeLogId using userId
            const response = await axios.get(`http://localhost:8080/time-log/getLatestLog/${uid}`);
            const { timelog_id: timelogId } = response.data; // Destructure timeLogId

            console.log("1: ",timelogId);
            console.log("2: ",logoutTime);
            // Send logout time to backend
            await axios.post('http://localhost:8080/time-log/logout', {
                timelogId, // Use timeLogId
                logoutTime,
            });

            // Clear tokens and navigate to login
            localStorage.removeItem('authToken');
            navigate('/');
        } catch (error) {
            console.error('Error logging out', error);
        }
    };

    const filterStudentReports = () => {
        return studentReports.filter(report => {
            const matchesYear = yearFilter ? report.student.schoolYear === yearFilter : true;
            const matchesMonth = monthFilter ? report.date.includes(`-${monthFilter}-`) : true;
            const matchesGrade = gradeFilter ? report.student.grade === gradeFilter : true;

            return matchesYear && matchesMonth && matchesGrade;
        });
    };

    const filteredReports = filterStudentReports();

    const monitoredRecordCounts = filteredReports.reduce((acc, report) => {
        const monitoredRecord = report.monitored_record;
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
        <div className={styles.wrapper}>
            <div className={styles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']} />
                {createSidebarLink("/report", "Record", AssessmentIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/student", "Student", SchoolIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {loggedInUser.userType !== 2 && (
                    <>
                        {loggedInUser.userType === 3
                            ? createSidebarLink("/adviserCase", "Case", PostAddIcon)
                            : createSidebarLink("/case", "Case", PostAddIcon)}
                    </>
                )}
                {loggedInUser.userType !== 1 && loggedInUser.userType !== 3 && createSidebarLink("/viewSanctions", "Sanctions", LocalPoliceIcon)}
                {loggedInUser.userType === 1 && createSidebarLink("/timeLog", "Time Log", AccessTimeFilledIcon)}
                <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
            </div>
            <div className={styles.content}>
                <h1>Records</h1>
                <div>
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
                <div>
                    <h2>Monitored Record Counts:</h2>
                    <CanvasJSChart options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default Report;
