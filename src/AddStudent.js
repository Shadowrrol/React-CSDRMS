import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AddStudent.css';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';

const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className="styled-link">
        <IconComponent className="icon" /> {/* Icon */}
        <span className="link-text">{text}</span> {/* Text */}
    </Link>
);
const AddStudent = () => {
    const [studentData, setStudentData] = useState({
        sid: '',
        firstname: '',
        middlename: '',
        lastname: '',
        grade: '',
        section: '',
        con_num: ''
    });

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
        <div className="wrapper" style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
            <div className="sidenav">
                <img src="/image-removebg-preview (1).png" alt="" className="sidebar-logo"/>
                {createSidebarLink("/account", "Account", AccountBoxIcon)}
                {createSidebarLink("/student", "Student", SchoolIcon)}
                {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
                {createSidebarLink("/case", "Case", PostAddIcon)}
                {createSidebarLink("/pendings", "Pendings", PendingActionsIcon)}
                {createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
                {createSidebarLink("/report", "Report", AssessmentIcon)}
            </div>
            <div className="content">
                <h2>Add Student</h2>
                <form onSubmit={handleSubmit} className="add-student-form">
                    <label>
                        Student ID:
                        <input
                            type="text"
                            name="sid"
                            value={studentData.sid}
                            onChange={handleChange}
                            placeholder="Student ID"
                        />
                    </label>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstname"
                            value={studentData.firstname}
                            onChange={handleChange}
                            placeholder="First Name"
                        />
                    </label>
                    <label>
                        Middle Name:
                        <input
                            type="text"
                            name="middlename"
                            value={studentData.middlename}
                            onChange={handleChange}
                            placeholder="Middle Name"
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastname"
                            value={studentData.lastname}
                            onChange={handleChange}
                            placeholder="Last Name"
                        />
                    </label>
                    <label>
                        Grade:
                        <input
                            type="number"
                            name="grade"
                            value={studentData.grade}
                            onChange={handleChange}
                            placeholder="Grade"
                        />
                    </label>
                    <label>
                        Section:
                        <select
                            name="section"
                            value={studentData.section}
                            onChange={handleChange}
                        >
                            <option value="">Select Section</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                        </select>
                    </label>
                    <label>
                        Contact Number:
                        <input
                            type="text"
                            name="con_num"
                            value={studentData.con_num}
                            onChange={handleChange}
                            placeholder="Contact Number"
                        />
                    </label>
                    <button type="submit" className="add-student-button">Add Student</button>
                </form>
            </div>
        </div>
    );
};

export default AddStudent;
