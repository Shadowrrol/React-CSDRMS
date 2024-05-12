import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../Navigation.module.css';
import axios from 'axios';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';

const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={styles['styled-link']}>
        <IconComponent className={styles.icon} />
        <span className={styles['link-text']}>{text}</span>
    </Link>
);

const Report = () => {
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = JSON.parse(authToken);
    const navigate = useNavigate(); 
    const [studentReports, setStudentReports] = useState([]);
    const [yearFilter, setYearFilter] = useState(null);
    const [monthFilter, setMonthFilter] = useState(null);
    const [gradeFilter, setGradeFilter] = useState(null);

    useEffect(() => {
        // Function to fetch student reports based on user type
        const fetchStudentReports = async () => {
            try {
                let response;
                if (loggedInUser.userType === 3) {
                    response = await axios.get(`http://localhost:8080/student-report/getStudentReportsBySectionAndSchoolYear?section=${loggedInUser.section}&schoolYear=${loggedInUser.schoolYear}`);
                } else {
                    response = await axios.get('http://localhost:8080/student-report/getAllStudentReports');
                }
                setStudentReports(response.data);
            } catch (error) {
                console.error('Error fetching student reports:', error);
            }
        };
    
        fetchStudentReports();
    }, [yearFilter]);

    const handleLogout = () => {
        // Clear the authentication token from localStorage
        localStorage.removeItem('authToken');
        // Redirect the user to the login page
        navigate('/');
    };
    

    // Function to filter student reports by year, month, and/or grade
    const filterStudentReports = () => {
        let filteredReports = studentReports;

        if (yearFilter) {
            filteredReports = filteredReports.filter(report => report.student.schoolYear === yearFilter);
        }

        if (monthFilter) {
            filteredReports = filteredReports.filter(report => report.date.includes(`-${monthFilter}-`));
        }

        if (gradeFilter) {
            filteredReports = filteredReports.filter(report => report.student.grade === gradeFilter);
        }

        // Count occurrences of each monitored_record
        const monitoredRecordCounts = {};
        filteredReports.forEach(report => {
            const monitoredRecord = report.monitored_record;
            monitoredRecordCounts[monitoredRecord] = (monitoredRecordCounts[monitoredRecord] || 0) + 1;
        });

        return { filteredReports, monitoredRecordCounts };
    };

    const { filteredReports, monitoredRecordCounts } = filterStudentReports();

    return (
        <div className={styles.wrapper}>
            <div className={styles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']} />
                {createSidebarLink("/report", "Report", AssessmentIcon)}
                {loggedInUser.userType !== 2 && loggedInUser.userType !== 3 && createSidebarLink("/account", "Account", AccountBoxIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/student", "Student", SchoolIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/case", "Case", PostAddIcon)}
                {loggedInUser.userType !== 2 && loggedInUser.userType !== 3 && createSidebarLink("/pendings", "Pendings", PendingActionsIcon)}
                {loggedInUser.userType !== 1 && loggedInUser.userType !== 3 && createSidebarLink("/viewSanctions", "Sanctions", LocalPoliceIcon)}
                {loggedInUser.userType !== 2 && loggedInUser.userType !== 3 && createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
                <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
            </div>
            <div className={styles.content}>
                <h1>Records</h1>
                <div>
                    <h2>Filters:</h2>
                    {loggedInUser.userType !== 3 && (
                    <select onChange={e => setYearFilter(e.target.value)}>
                        <option value="">All Years</option>
                        <option value="2022-2023">2022-2023</option>
                        <option value="2023-2024">2023-2024</option>
                        <option value="2024-2025">2024-2025</option>
                        {/* Add more years as needed */}
                    </select>
                    )}
                    <select onChange={e => setMonthFilter(e.target.value)}>
                        <option value="">All Months</option>
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        {/* Add more months as needed */}
                    </select>
                    {loggedInUser.userType !== 3 && (
                    <select onChange={e => setGradeFilter(parseInt(e.target.value))}>
                        <option value="">All Grades</option>
                        <option value="7">Grade 7</option>
                        <option value="8">Grade 8</option>
                        <option value="9">Grade 9</option>
                        {/* Add more grades as needed */}
                    </select>
                    )}
                </div>
                <div>
                    <h2>Filtered Student Reports:</h2>
                    <ul>
                        {filteredReports.map(report => (
                            <li key={report.rid}>
                                {report.student.firstname} - Year: {report.student.schoolYear}, Grade: {report.student.grade}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h2>Monitored Record Counts:</h2>
                    <ul>
                        {Object.entries(monitoredRecordCounts).map(([monitoredRecord, count]) => (
                            <li key={monitoredRecord}>
                                {monitoredRecord}: {count}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Report;
