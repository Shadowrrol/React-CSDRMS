import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './AddStudent.css';

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
        .then(response => {
            if (response.ok) {
                // Handle successful insertion, maybe redirect or show a success message
            } else {
                // Handle errors, maybe show an error message
            }
        })
        .catch(error => {
            console.error('Error inserting student:', error);
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
                <h2>Add Student</h2>
                <form onSubmit={handleSubmit}>
                <label>
                        Student ID:
                        <input
                            type="text"
                            name="sid"
                            value={studentData.sid}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstname"
                            value={studentData.firstname}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Middle Name:
                        <input
                            type="text"
                            name="middlename"
                            value={studentData.middlename}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastname"
                            value={studentData.lastname}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Grade:
                        <input
                            type="number"
                            name="grade"
                            value={studentData.grade}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Section:
                        <input
                            type="text"
                            name="section"
                            value={studentData.section}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Contact Number:
                        <input
                            type="text"
                            name="con_num"
                            value={studentData.con_num}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit">Add Student</button>
                </form>
            </div>
        </div>
    );
};

export default AddStudent;
