import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css';
import studentStyles from './Student.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={styles['styled-link']}>
        <IconComponent className={styles.icon} />
        <span className={styles['link-text']}>{text}</span>
    </Link>
);

const AdviserStudent = () => {
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = JSON.parse(authToken);
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [file, setFile] = useState(null); // State to store the uploaded file
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "SSO | Student";
        
        if (loggedInUser) {
            const url = loggedInUser.userType === 3
                ? `http://localhost:8080/student/getAllStudentsByAdviser/${loggedInUser.section}/${loggedInUser.schoolYear}`
                : 'http://localhost:8080/student/getAllCurrentStudents';

            fetch(url)
                .then(response => response.json())
                .then(data => setStudents(data))
                .catch(error => console.error('Error fetching students:', error));
        } else {
            console.error('Logged-in user details are missing.');
        }
    }, [loggedInUser]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const handleDelete = (sid) => {
        if (window.confirm(`Type 'delete' to confirm deletion of student SID ${sid}`)) {
            fetch(`http://localhost:8080/student/deleteStudent/${sid}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        setStudents(prevStudents => prevStudents.filter(student => student.sid !== sid));
                    } else {
                        console.error('Failed to delete student');
                    }
                })
                .catch(error => console.error('Error deleting student:', error));
        }
    };

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
    };

    const handleAddReport = () => {
        if (selectedStudent.current === 0) {
            alert('You cannot add a report to this student.');
        } else {
            navigate(`/add-report/${selectedStudent.id}`);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8080/student/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                alert('File uploaded successfully!');
                // Optionally, refetch the student data after upload
                setStudents(prevStudents => [...prevStudents, ...response.data]);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    // Updated filtering logic
    const filteredStudents = useMemo(() => students.filter(student => {
        const query = searchQuery.toLowerCase();
        const name = `${student.firstname} ${student.middlename ? student.middlename + ' ' : ''}${student.lastname}`.toLowerCase();
        const gradeSection = `${student.grade} - ${student.section}`.toLowerCase();
        return (
            (student.sid && student.sid.toLowerCase().includes(query)) ||
            name.includes(query) ||
            gradeSection.includes(query) ||
            (student.con_num && student.con_num.toLowerCase().includes(query))
        );
    }), [students, searchQuery]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']} />
                {createSidebarLink("/report", "Record", AssessmentIcon)}
                {createSidebarLink("/student", "Student", SchoolIcon)}
                {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {loggedInUser.userType !== 2 && (
                    <>
                        {loggedInUser.userType === 3
                            ? createSidebarLink("/adviserCase", "Case", PostAddIcon)
                            : createSidebarLink("/case", "Case", PostAddIcon)}
                    </>
                )}
                 {loggedInUser.userType === 1 && createSidebarLink("/timelog", "Time Log", AccessTimeFilledIcon)}
                <button className={styles.logoutbtn} onClick={handleLogout}>Logout</button>
            </div>
            <div className={styles.content}>
                <div className={studentStyles['student-content']}>
                    <h2>Student Records</h2>
                    <input
                        type="search"
                        placeholder="Search by SID, Name, Grade - Section or Contact No."      
                        className={studentStyles.searchStud}                 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {loggedInUser.userType === 3 && (
                        <Link to="/add-student">
                            <button className={studentStyles['add-student-button']}>Add Student</button>
                        </Link>
                    )}
                    <div className={studentStyles['import-section']}>
                        <input type="file" onChange={handleFileChange} accept=".xls,.xlsx" />
                        <button onClick={handleFileUpload} className={studentStyles['import-button']}>Import Student Data</button>
                    </div>

                    <div className={studentStyles['student-container']}>
                        <table className={studentStyles['student-table']}>
                            <thead>
                                <tr>
                                    <th>SID</th>
                                    <th>Name</th>
                                    <th>Grade - Section</th>
                                    <th>Contact No.</th>
                                    {loggedInUser.userType === 3 && <th>Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(student => (
                                    <tr
                                        key={student.id}
                                        onClick={() => handleSelectStudent(student)}
                                        className={selectedStudent?.id === student.id ? studentStyles['selected-row'] : ''}
                                    >
                                        <td>{student.sid}</td>
                                        <td>{`${student.firstname} ${student.middlename ? student.middlename + ' ' : ''}${student.lastname}`}</td>
                                        <td>{`${student.grade} - ${student.section}`}</td>
                                        <td>{student.con_num}</td>
                                        {loggedInUser.userType === 3 && (
                                            <td>
                                                <Link to={`/update-student/${student.sid}`}>
                                                    <EditIcon className={`${studentStyles['icon-button']} ${studentStyles['icon-edit']}`} />
                                                </Link>
                                                <DeleteIcon className={`${studentStyles['icon-button']} ${studentStyles['icon-delete']}`} onClick={() => handleDelete(student.sid)} />
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Add Report Button */}
                    {selectedStudent && (
                        <button onClick={handleAddReport} className={studentStyles['add-report-button']}>
                            Add Report for {selectedStudent.firstname} {selectedStudent.lastname}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdviserStudent;
