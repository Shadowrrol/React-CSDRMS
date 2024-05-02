import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navigation.module.css'; // Import CSS module
import './Student.css';

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

const Student = () => {
    const location = useLocation();
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/student/getAllStudents')
            .then(response => response.json())
            .then(data => setStudents(data))
            .catch(error => console.error('Error fetching students:', error));
    }, []);

    const handleDelete = (sid) => {
        fetch(`http://localhost:8080/student/deleteStudent/${sid}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                // Remove the deleted student from the state
                setStudents(students.filter(student => student.sid !== sid));
            } else {
                // Handle errors, maybe show an error message
            }
        })
        .catch(error => {
            console.error('Error deleting student:', error);
            // Handle errors, maybe show an error message
        });
    };

    // Function to filter students based on search query
    const filteredStudents = students.filter(student =>
        student.sid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
            <div className={styles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']}/>
                {createSidebarLink("/account", "Account", AccountBoxIcon)}
                {createSidebarLink("/student", "Student", SchoolIcon)}
                {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
                {createSidebarLink("/case", "Case", PostAddIcon)}
                {createSidebarLink("/pendings", "Pendings", PendingActionsIcon)}
                {createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
                {createSidebarLink("/report", "Report", AssessmentIcon)}
            </div>
            <div className='content'>
                <div className="student-content">
                    <h2>Students</h2>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by SID, First Name, or Last Name"
                    />
                    <Link to="/add-student">
                        <button>Add Student</button>
                    </Link>
                    {/* <Link to="/add-report"><button>Add Student Report</button></Link> */}
                    <table>
                        <thead>
                            <tr>
                                <th>SID</th>
                                <th>First Name</th>
                                <th>Middle Name</th>
                                <th>Last Name</th>
                                <th>Grade</th>
                                <th>Section</th>
                                <th>Contact Number</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr key={student.sid}>
                                    <td>{student.sid}</td>
                                    <td>{student.firstname}</td>
                                    <td>{student.middlename}</td>
                                    <td>{student.lastname}</td>
                                    <td>{student.grade}</td>
                                    <td>{student.section}</td>
                                    <td>{student.con_num}</td>
                                    <td>
                                        <Link to={`/update-student/${student.sid}`}>
                                            <button>Update</button>
                                        </Link>
                                        <button onClick={() => handleDelete(student.sid)}>Delete</button>
                                        <Link to={`/add-report/${student.sid}`}>
                                            <button>Add Report</button>
                                        </Link>
                                        <Link to={`/view-student-report/${student.sid}`}>
                                            <button>View Report</button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Student;
