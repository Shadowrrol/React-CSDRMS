import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from '../Navigation.module.css';
import styles2 from '../GlobalTable.module.css';

import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';

// Helper function to create sidebar links
const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={styles['styled-link']}>
        <IconComponent className={styles.icon} />
        <span className={styles['link-text']}>{text}</span>
    </Link>
);

const ViewStudentReport = () => {
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = JSON.parse(authToken);
    const navigate = useNavigate();
    const { id } = useParams();  
    const [student, setStudent] = useState(null);
    const [reports, setReports] = useState([]);

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    // Fetch student data based on userType
    useEffect(() => {
        const fetchStudent = async () => {
            try {
                let response;
                if (loggedInUser.userType === 3) {
                    response = await fetch(`http://localhost:8080/student/getStudentById/${id}`);
                } else {
                    response = await fetch(`http://localhost:8080/student/getCurrentStudent/${id}`);
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStudent(data);
            } catch (error) {
                console.error('Error fetching student:', error);
            }
        };

        fetchStudent();
    }, [id, loggedInUser.userType]);

    // Fetch reports based on student information and userType
    useEffect(() => {
        if (student && student.sid) {
            const fetchReports = async () => {
                try {
                    let response;
                    if (loggedInUser.userType === 3) {
                        const section = student.section;
                        const schoolYear = student.schoolYear;
                        response = await fetch(`http://localhost:8080/student-report/getStudentReportsBySectionAndSchoolYear?section=${section}&schoolYear=${schoolYear}`);
                    } else {
                        response = await fetch(`http://localhost:8080/student-report/getStudentReports/${student.sid}`);
                    }

                    const data = await response.json();
                    setReports(data);
                } catch (error) {
                    console.error('Error fetching reports:', error);
                }
            };

            fetchReports();
        }
    }, [student, loggedInUser.userType]);

    return (
        <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
            <div className={styles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']} />
                {createSidebarLink("/report", "Report", AssessmentIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/student", "Student", SchoolIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {loggedInUser.userType !== 1 && loggedInUser.userType !== 2 && createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/case", "Case", PostAddIcon)}
                {loggedInUser.userType !== 1 && loggedInUser.userType !== 2 && createSidebarLink("/viewSanctions", "Sanctions", LocalPoliceIcon)}
                {loggedInUser.userType !== 1 && loggedInUser.userType !== 2 && loggedInUser.userType !== 3 && createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
                {loggedInUser.userType !== 1 && loggedInUser.userType !== 2 && createSidebarLink("/Followup", "Followups", PendingActionsIcon)}
                <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
            </div>
            <div className={styles.content}>
                <h2>Student Details</h2>
                {student ? (
                    <div className={styles['student-details']}>
                        <p><strong>Name:</strong> {student.firstname} {student.middlename} {student.lastname}</p>
                        <p><strong>Grade:</strong> {student.grade}</p>
                        <p><strong>Section:</strong> {student.section}</p>
                        <p><strong>School Year:</strong> {student.schoolYear}</p>
                    </div>
                ) : (
                    <p>Loading student details...</p>
                )}

                <div className={styles['add-report-button']}>
                    {loggedInUser.userType !== 2 && student && (
                        <Link to={`/add-report/${student.id}`}>
                            <button>Add Report</button>
                        </Link>
                    )}
                </div>
                <div className={styles2['table-container']}>
                    <h2>Student Reports</h2>
                    <table className={styles2['global-table']}>
                        <thead>
                            <tr>
                                <th>School Year</th>
                                <th>Grade</th>
                                <th>Section</th>
                                <th>Incident Date</th>
                                <th>Monitored Record</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map(report => (
                                <tr key={report.rid}>
                                    <td>{report.student.schoolYear}</td>
                                    <td>{report.student.grade}</td>
                                    <td>{report.student.section}</td>
                                    <td>{report.incident_date}</td>
                                    <td>{report.monitored_record}</td>
                                    <td>{report.remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewStudentReport;
