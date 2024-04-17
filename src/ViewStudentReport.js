// ViewStudentReport.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import useParams hook and Link component

const ViewStudentReport = () => {
    const { sid } = useParams(); // Destructure sid from useParams
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            const response = await fetch(`http://localhost:8080/student-report/getStudentReports/${sid}`);
            const data = await response.json();
            setReports(data);
        };
        fetchReports();
    }, [sid]); // Add sid to the dependency array

    return (
        <div>
            <h2>Student Reports</h2>
            {/* Pass sid as a parameter when redirecting */}
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
