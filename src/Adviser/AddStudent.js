import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Navigation.module.css'; // Import CSS module
import styles1 from './AddStudent.module.css'; // Import AddStudent.css

// Import icons from Material-UI
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';

const AddStudent = () => {
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = JSON.parse(authToken);
    const navigate = useNavigate(); 
    const [studentData, setStudentData] = useState({
        sid: '',
        firstname: '',
        middlename: '',
        lastname: '',
        grade: loggedInUser.grade,
        section: loggedInUser.section,
        schoolYear: loggedInUser.schoolYear,
        adviser_id:  loggedInUser.uid,
        con_num: ''
    });
    
    const createSidebarLink = (to, text, IconComponent) => (
        <Link to={to} className={styles['styled-link']}>
            <IconComponent className={styles.icon} /> 
            <span className={styles['link-text']}>{text}</span> 
        </Link>
    );
    
    const handleLogout = () => {
        // Clear the authentication token from localStorage
        localStorage.removeItem('authToken');
        // Redirect the user to the login page
        navigate('/');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentData({ ...studentData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:8080/student/insertStudent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        })
        .then((response) => {
            if (response.ok) {
                // Handle successful insertion, maybe redirect or show a success message
            } else {
                // Handle errors, maybe show an error message
            }
        })
        .catch((error) => {
            console.error('Error inserting student:', error);
            // Handle errors, maybe show an error message
        });
    };

    return (
        <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
            <div className={styles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']}/>
                {createSidebarLink("/report", "Report", AssessmentIcon)}
                {loggedInUser.userType !== 3 && createSidebarLink("/account", "Account", AccountBoxIcon)}
                {createSidebarLink("/student", "Student", SchoolIcon)}
                {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
                {createSidebarLink("/case", "Case", PostAddIcon)}
                {loggedInUser.userType !== 3 && createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
                {loggedInUser.userType === 3 && createSidebarLink("/Followup", "Followups", PendingActionsIcon)}
                <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
            </div>
            <div className={styles1.content}>
                <div className={styles1.contentform}>
                    <h2>Add Student</h2>
                    <form onSubmit={handleSubmit} className={styles1['add-student-form']}>
                        <div className={styles1['form-container']}>
                            <div className={styles1['form-group']}>
                                <label htmlFor="sid">Student ID:</label>
                                <input 
                                    type="text"
                                    id="sid"
                                    name="sid"
                                    value={studentData.sid}
                                    onChange={handleChange}
                                    placeholder="Student ID"
                                />
                            </div>
                            <div className={styles1['form-group']}>
                                <label htmlFor="firstname">First Name:</label>
                                <input
                                    type="text"
                                    id="firstname"
                                    name="firstname"
                                    value={studentData.firstname}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                />
                            </div>
                            <div className={styles1['form-group']}>
                                <label htmlFor="middlename">Middle Name:</label>
                                <input
                                    type="text"
                                    id="middlename"
                                    name="middlename"
                                    value={studentData.middlename}
                                    onChange={handleChange}
                                    placeholder="Middle Name"
                                />
                            </div>
                            <div className={styles1['form-group']}>
                                <label htmlFor="lastname">Last Name:</label>
                                <input
                                    type="text"
                                    id="lastname"
                                    name="lastname"
                                    value={studentData.lastname}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                />
                            </div>
                            <div className={styles1['form-group']}>
                                <label htmlFor="grade">Grade:</label>
                                <input
                                    type="number"
                                    id="grade"
                                    name="grade"
                                    value={studentData.grade}
                                    onChange={handleChange}
                                    placeholder="Grade"
                                    disabled // Disable input
                                />
                            </div>
                            <div className={styles1['form-group']}>
                                <label htmlFor="section">Section:</label>
                                <input
                                    type="text"
                                    id="section"
                                    name="section"
                                    value={studentData.section}
                                    onChange={handleChange}
                                    placeholder="Section"
                                    disabled // Disable input
                                />
                            </div>
                            <div className={styles1['form-group']}>
                                <label htmlFor="schoolYear">School Year:</label>
                                <input
                                    type="text"
                                    id="schoolYear"
                                    name="schoolYear"
                                    value={studentData.schoolYear}
                                    onChange={handleChange}
                                    placeholder="School Year"
                                    disabled // Disable input
                                />
                            </div>
                            <div className={styles1['form-group']}>
                                <label htmlFor="con_num">Contact Number:</label>
                                <input
                                    type="text"
                                    id="con_num"
                                    name="con_num"
                                    value={studentData.con_num}
                                    onChange={handleChange}
                                    placeholder="Contact Number"
                                />
                            </div>
                            <button type="submit" className={styles1['add-student-button']}>Add Student</button>
                        </div>
                    </form>
                </div>    
            </div>
        </div>
    );
};

export default AddStudent;
