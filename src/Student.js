import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Student.css';

const Student = () => {
    const location = useLocation();
    const [students, setStudents] = useState([]);

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

    return (
        <div className='wrapper'>
            <div className="sidenav">
                {/* Navigation links */}
                <Link to="/account">Account</Link>
                <Link to="/student">Student</Link>
                <Link to="/notification">Notification</Link>
                <Link to="/feedback">Feedback</Link>
                <Link to="/case">Case</Link>
                <Link to="/pendings">Pendings</Link>
                <Link to="/sanctions">Sanctions</Link>
                <Link to="/report">Report</Link>
            </div>
            <div className='content'>
                <div className="student-content">
                    <h2>Students</h2>
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
                            {students.map(student => (
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
