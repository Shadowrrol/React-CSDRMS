import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UpdateStudent = () => {
    const { sid } = useParams();
    const [studentData, setStudentData] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        grade: '',
        section: '',
        con_num: '',
    });

    useEffect(() => {
        fetch(`http://localhost:8080/student/getStudent/${sid}`)
            .then(response => response.json())
            .then(data => setStudentData(data))
            .catch(error => console.error('Error fetching student:', error));
    }, [sid]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentData({ ...studentData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8080/student/updateStudent?sid=${sid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        })
        .then(response => {
            if (response.ok) {
                // Handle successful update, maybe redirect or show a success message
            } else {
                // Handle errors, maybe show an error message
            }
        })
        .catch(error => {
            console.error('Error updating student:', error);
            // Handle errors, maybe show an error message
        });
    };

    return (
        <div>
            <h2>Update Student</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Update Student</button>
            </form>
        </div>
    );
};

export default UpdateStudent;
