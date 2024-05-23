import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css'; // Import CSS module
import './Student.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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

const AdviserStudent = () => {
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = JSON.parse(authToken);
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Student";
        // Check if the logged-in user's school year and section exist
        if (loggedInUser) {
            let url;
            if (loggedInUser.userType === 3) {
                // Use the URL for user type 3
                url = `http://localhost:8080/student/getAllStudents/${loggedInUser.schoolYear}/${loggedInUser.section}`;
            } else {
                // Use the default URL
                url = 'http://localhost:8080/student/getAllStudents';
            }

            // Fetch students based on the URL
            fetch(url)
                .then(response => response.json())
                .then(data => setStudents(data))
                .catch(error => console.error('Error fetching students:', error));
        } else {
            console.error('Logged-in user details are missing.');
        }
    }, []);

    const handleLogout = () => {
        // Clear the authentication token from localStorage
        localStorage.removeItem('authToken');
        // Redirect the user to the login page
        navigate('/');
    };

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

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
    };

    // Function to filter students based on search query
    const filteredStudents = students.filter(student =>
        student.sid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.wrapper}>
            <div className={styles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']}/>
                {createSidebarLink("/report", "Report", AssessmentIcon)}
                {createSidebarLink("/student", "Student", SchoolIcon)}
                {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {loggedInUser.userType !== 1 && createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
                {loggedInUser.userType !== 2 && (
                    <>
                        {loggedInUser.userType === 3 ? 
                            createSidebarLink("/adviserCase", "Case", PostAddIcon) :
                            createSidebarLink("/case", "Case", PostAddIcon)
                        }
                    </>
                )}
                {loggedInUser.userType !== 3 && createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
                {loggedInUser.userType !== 1 && loggedInUser.userType !== 2 && createSidebarLink("/Followup", "Followups", PendingActionsIcon)}
                <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
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
                    {loggedInUser.userType === 3 && (
                        <Link to="/add-student">
                            <button>Add Student</button>
                        </Link>
                    )}
                    <table className="student-table">
                        <thead>
                            <tr>
                                <th>SID</th>
                                <th>First Name</th>
                                <th>Middle Name</th>
                                <th>Last Name</th>
                                <th>Grade</th>
                                <th>Section</th>
                                <th>Contact Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr 
                                    key={student.sid} 
                                    onClick={() => handleSelectStudent(student)}
                                    className={selectedStudent?.sid === student.sid ? 'selected-row' : ''}
                                >
                                    <td>{student.sid}</td>
                                    <td>{student.firstname}</td>
                                    <td>{student.middlename}</td>
                                    <td>{student.lastname}</td>
                                    <td>{student.grade}</td>
                                    <td>{student.section}</td>
                                    <td>{student.con_num}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {selectedStudent && (
                        <div className="action-buttons">
                            {loggedInUser.userType === 3 && (
                                <>
                                    <Link to={`/update-student/${selectedStudent.sid}`}>
                                        <EditIcon className="icon-button icon-edit" />
                                    </Link>
                                    <DeleteIcon className="icon-button icon-delete" onClick={() => handleDelete(selectedStudent.sid)} />
                                </>
                            )}
                            <Link to={`/add-report/${selectedStudent.sid}`}>
                                <button>Add Report</button>
                            </Link>
                            <Link to={`/view-student-report/${selectedStudent.sid}`}>
                                <button>View Report</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdviserStudent;
