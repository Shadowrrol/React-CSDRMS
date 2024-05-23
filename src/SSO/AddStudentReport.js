import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './AddStudentReport.css'; // Import CSS file for styling
import styles from '../Navigation.module.css';
import styles1 from '../GlobalForm.module.css';

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
        <IconComponent className={styles.icon} /> {/* Icon */}
        <span className={styles['link-text']}>{text}</span> {/* Text */}
    </Link>
);

const AddStudentReport = () => {
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = JSON.parse(authToken);
    const navigate = useNavigate();
    const { sid } = useParams();
    const [student, setStudent] = useState(null);
    const [report, setReport] = useState({
        sid: '',
        date: '',
        time: '',
        monitored_record: '',
        remarks: '',
        sanction: ''
    });

    const handleLogout = () => {
        // Clear the authentication token from localStorage
        localStorage.removeItem('authToken');
        // Redirect the user to the login page
        navigate('/');
    };

    useEffect(() => {
        document.title = "Add Report";
        const fetchStudent = async () => {
            try {
                const response = await fetch(`http://localhost:8080/student/getStudent/${sid}`);
                if (response.ok) {
                    const data = await response.json();
                    setStudent(data);
                } else {
                    throw new Error('Failed to fetch student details');
                }
            } catch (error) {
                console.error('Error fetching student details:', error);
            }
        };
        fetchStudent();
    }, [sid]);

    useEffect(() => {
        if (student) {
            setReport(prevReport => ({ ...prevReport, sid: student.sid }));
        }
    }, [student]);

    const handleChange = e => {
        const { name, value } = e.target;
        setReport({ ...report, [name]: value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const { firstname, middlename, lastname } = student;
        const name = `${firstname} ${middlename} ${lastname}`;
        const newReport = { ...report, name };
        const response = await fetch('http://localhost:8080/student-report/insertReport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newReport)
        });
        if (response.ok) {
            navigate(`/view-student-report/${student.sid}`);
        }
    };

    if (!student) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
            <div className={styles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']}/>
                {createSidebarLink("/report", "Report", AssessmentIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/student", "Student", SchoolIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {loggedInUser.userType !== 1 && loggedInUser.userType !== 2 && createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
                {loggedInUser.userType !== 2 && createSidebarLink("/case", "Case", PostAddIcon)}
                {loggedInUser.userType !== 1 && loggedInUser.userType !== 3 && createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
                {loggedInUser.userType !== 1 && loggedInUser.userType !== 2 && createSidebarLink("/Followup", "Followups", PendingActionsIcon)}
                <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
            </div>            
            <div className={styles1.content}>
                <div className={styles1.contentform}>
                    <h1>Add Student Report</h1>
                    <h2>Student Details</h2>
                    <p>Name: {student.firstname} {student.middlename} {student.lastname}</p>
                    <p>Grade: {student.grade}</p>
                    <p>Section: {student.section}</p>
                    <p>Contact Number: {student.con_num}</p>
                    <form onSubmit={handleSubmit}>
                        <input type="hidden" name="sid" value={report.sid} required />
                        <label>
                            Date:
                            <input type="date" name="date" value={report.date} onChange={handleChange} required />
                        </label>
                        <label>
                            Time:
                            <input type="time" name="time" value={report.time} onChange={handleChange} required />
                        </label>
                        <label>
                            Monitored Record:
                            <select name="monitored_record" value={report.monitored_record} onChange={handleChange} required>
                                <option value="">Select Monitored Record</option>
                                <option value="Clinic">Clinic</option>
                                <option value="Tardy">Tardy</option>
                                <option value="Absent">Absent</option>
                                <option value="Improper Uniform">Improper Uniform</option>
                                <option value="Cutting Classes">Cutting Classes</option>
                                <option value="Offense">Offense</option>
                                <option value="Misbehavior">Misbehavior</option>
                                <option value="Sanction">Sanction</option>
                            </select>
                        </label>
                        <label>
                            Remarks:
                            <input type="text" name="remarks" value={report.remarks} onChange={handleChange} required />
                        </label>
                        <label>
                            Sanction:
                            <input type="text" name="sanction" value={report.sanction} onChange={handleChange} required />
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddStudentReport;
