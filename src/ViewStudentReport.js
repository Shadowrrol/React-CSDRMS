import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ViewStudentReport = () => {
    const { sid } = useParams();
    const [reports, setReports] = useState([]);
    const [student, setStudent] = useState(null); // State to store student details

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await fetch(`http://localhost:8080/student/getStudent/${sid}`);
                const data = await response.json();
                setStudent(data); // Update student state with fetched data
            } catch (error) {
                console.error('Error fetching student:', error);
            }
        };

        fetchStudent();
    }, [sid]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch(`http://localhost:8080/student-report/getStudentReports/${sid}`);
                const data = await response.json();
                setReports(data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchReports();
    }, [sid]);

    return (
        <div>
            <h2>Student Details</h2>
            {student && (
                <div>
                    <p>Name: {student.firstname} {student.middlename} {student.lastname}</p>
                    <p>Grade: {student.grade}</p>
                    <p>Section: {student.section}</p>
                    <p>Contact Number: {student.con_num}</p>
                </div>
            )}

            <h2>Student Reports</h2>
            <Link to={`/add-report/${sid}`}>
                <button>Add Report</button>
            </Link>
            <table>
                <thead>
                    <tr>
                        <th>Report ID</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Name</th>
                        <th>Monitored Record</th>
                        <th>Remarks</th>
                        <th>Sanction</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map(report => (
                        <tr key={report.rid}>
                            <td>{report.rid}</td>
                            <td>{report.date}</td>
                            <td>{report.time}</td>
                            <td>{report.name}</td>
                            <td>{report.monitored_record}</td>
                            <td>{report.remarks}</td>
                            <td>{report.sanction}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewStudentReport;
