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

const months = [
    { value: '', label: 'All months' },
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' }
];

const Report = () => {
    const [reports, setReports] = useState([]);
    const [monitoredRecordsCount, setMonitoredRecordsCount] = useState({});
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        countMonitoredRecords(reports);
    }, [reports]);

    const fetchReports = async () => {
        const response = await fetch('http://localhost:8080/student-report/getAllStudentReports');
        const data = await response.json();
        setReports(data);
    };

    const countMonitoredRecords = (reports) => {
        const count = {};
        reports.forEach(report => {
            const reportDate = new Date(report.date);
            const month = reportDate.getMonth();
            if (!count[month]) {
                count[month] = {};
            }
            count[month][report.monitored_record] = (count[month][report.monitored_record] || 0) + 1;
            if (!count['all']) {
                count['all'] = {};
            }
            count['all'][report.monitored_record] = (count['all'][report.monitored_record] || 0) + 1;
        });
        setMonitoredRecordsCount(count);
    };

    const handleMonthChange = (event) => {
        const month = event.target.value;
        setSelectedMonth(month);
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
            <div>
                <select value={selectedMonth} onChange={handleMonthChange}>
                    {months.map(month => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                </select>
            </div>
            {selectedMonth !== '' && (
                <div>
                    <h2>Monitored Record Totals for {selectedMonth === '' ? 'All months' : months.find(m => m.value === selectedMonth)?.label}</h2>
                    <ul>
                        {Object.entries(monitoredRecordsCount[selectedMonth || 'all'] || {}).map(([record, count]) => (
                            <li key={record}>
                                {record}: {count}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {selectedMonth === '' && (
                <div>
                    <h2>Monitored Record Totals for All months</h2>
                    <ul>
                        {Object.entries(monitoredRecordsCount['all'] || {}).map(([record, count]) => (
                            <li key={record}>
                                {record}: {count}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div>
                <h2>All Reports</h2>
                <ul>
                    {reports.map(report => (
                        <li key={report.rid}>
                            <p>Monitored Record: {report.monitored_record}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Report;
