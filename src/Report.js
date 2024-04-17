import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Report = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        const response = await fetch('http://localhost:8080/student-report/getAllStudentReports');
        const data = await response.json();
        setReports(data);
    };

    return (
        <div>
            <h1>All Student Reports</h1>
            <ul>
                {reports.map(report => (
                    <li key={report.rid}>
                        <p>SID: {report.sid}</p>
                        <p>Date: {report.date}</p>
                        <p>Time: {report.time}</p>
                        <p>Name: {report.name}</p>
                        <p>Monitored Record: {report.monitored_record}</p>
                        <p>Remarks: {report.remarks}</p>
                        <p>Sanction: {report.sanction}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Report;
