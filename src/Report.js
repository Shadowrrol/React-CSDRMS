import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
