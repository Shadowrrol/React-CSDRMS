import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Navigation.module.css'; // Import CSS module
import styles1 from './AddStudent.module.css'; // Import AddStudent.css

// Import icons from Material-UI
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AssessmentIcon from '@mui/icons-material/Assessment';

const AddStudent = () => {
    useEffect(() => {
        document.title = "Adviser | Add Student";
    }, []); 

    const authToken = localStorage.getItem('authToken');
    const loggedInUser = JSON.parse(authToken);
    const navigate = useNavigate(); 

    const [studentData, setStudentData] = useState({
        sid: '',
        name: '',
        grade: '',
        section: '',
        gender: '', // Adding gender field to the state
        schoolYear: '',
        current: 1
    });

    const [grades, setGrades] = useState([]);
    const [sections, setSections] = useState([]);
    const [schoolYears, setSchoolYears] = useState([]);

    // Fetch grades and school years on component mount
    useEffect(() => {
        fetch('http://localhost:8080/class/allUniqueGrades')
            .then((response) => response.json())
            .then((data) => setGrades(data))
            .catch((error) => console.error('Error fetching grades:', error));

        fetch('http://localhost:8080/schoolYear/getAllSchoolYears')
            .then((response) => response.json())
            .then((data) => setSchoolYears(data))
            .catch((error) => console.error('Error fetching school years:', error));
    }, []);

    // Fetch sections when grade is selected
    useEffect(() => {
        if (studentData.grade) {
            fetch(`http://localhost:8080/class/sections/${studentData.grade}`)
                .then((response) => response.json())
                .then((data) => setSections(data))
                .catch((error) => console.error('Error fetching sections:', error));
        }
    }, [studentData.grade]);

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
                navigate(`/student`);
            } else {
                alert('Student with this ID and school year already exists.');
            }
        })
        .catch((error) => {
            console.error('Error inserting student:', error);
        });
    };

    const createSidebarLink = (to, text, IconComponent) => (
        <Link to={to} className={styles['styled-link']}>
            <IconComponent className={styles.icon} /> 
            <span className={styles['link-text']}>{text}</span> 
        </Link>
    );

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    return (
        <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
            <div className={styles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']}/>
                {createSidebarLink("/record", "Record", AssessmentIcon)}
                {createSidebarLink("/student", "Student", SchoolIcon)}
                {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {createSidebarLink("/report", "Report", PostAddIcon)}
                <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
            </div>
            <div className={styles1.content}>
                <div className={styles1.contentform}>
                    <h2>Add Student</h2>
                    <form onSubmit={handleSubmit} className={styles1['add-student-form']}>
                        <div className={styles1['form-container']}>
                            <div className={styles1['form-group']}>
                                <label className={styles1['student-label']} htmlFor="sid">Student ID:</label>
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
                                <label className={styles1['student-label']} htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={studentData.name}
                                    onChange={handleChange}
                                    placeholder="Lastname, Firstname Middlename"
                                />
                            </div>
                            <div className={styles1['form-group']}>
                                <label className={styles1['student-label']} htmlFor="grade">Grade:</label>
                                <select
                                    id="grade"
                                    name="grade"
                                    value={studentData.grade}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Grade</option>
                                    {grades.map((grade) => (
                                        <option key={grade} value={grade}>
                                            {grade}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles1['form-group']}>
                                <label className={styles1['student-label']} htmlFor="section">Section:</label>
                                <select
                                    id="section"
                                    name="section"
                                    value={studentData.section}
                                    onChange={handleChange}
                                    disabled={!studentData.grade} // Disable until grade is selected
                                >
                                    <option value="">Select Section</option>
                                    {sections.map((section, index) => (
                                        <option key={index} value={section}>
                                            {section}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Gender field added here */}
                            <div className={styles1['form-group']}>
                                <label className={styles1['student-label']} htmlFor="gender">Gender:</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={studentData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className={styles1['form-group']}>
                                <label className={styles1['student-label']} htmlFor="schoolYear">School Year:</label>
                                <select
                                    id="schoolYear"
                                    name="schoolYear"
                                    value={studentData.schoolYear}
                                    onChange={handleChange}
                                >
                                    <option value="">Select School Year</option>
                                    {schoolYears.map((sy) => (
                                        <option key={sy.schoolYear_ID} value={sy.schoolYear}>
                                            {sy.schoolYear}
                                        </option>
                                    ))}
                                </select>
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
