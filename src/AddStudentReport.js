import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AddStudentReport = () => {
    const { sid } = useParams(); // Destructure sid from useParams
    const [student, setStudent] = useState(null); // State to store student details
    const [report, setReport] = useState({
        sid: '', // Add sid field to report state
        date: '',
        time: '',
        monitored_record: '',
        remarks: '',
        sanction: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
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
    }, [sid]); // Fetch student details when sid changes

    useEffect(() => {
        // Update report state with the current sid when student data is fetched
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
        return <div>Loading...</div>; // Render loading state while fetching student details
    }

    return (
        <div>
            <h1>Add Student Report</h1>
            <h2>Student Details</h2>
            <p>Name: {student.firstname} {student.middlename} {student.lastname}</p>
            <p>Grade: {student.grade}</p>
            <p>Section: {student.section}</p>
            <p>Contact Number: {student.con_num}</p>
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="sid" value={report.sid} /> {/* Hidden input for sid */}
                <label>
                    Date:
                    <input type="date" name="date" value={report.date} onChange={handleChange} />
                </label>
                <label>
                    Time:
                    <input type="time" name="time" value={report.time} onChange={handleChange} />
                </label>
                <label>
                    Monitored Record:
                    <select name="monitored_record" value={report.monitored_record} onChange={handleChange}>
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
                    <input type="text" name="remarks" value={report.remarks} onChange={handleChange} />
                </label>
                <label>
                    Sanction:
                    <input type="text" name="sanction" value={report.sanction} onChange={handleChange} />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AddStudentReport;
