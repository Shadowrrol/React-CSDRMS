import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdviserTimeLogModal.module.css';

const AdviserTimeLogModal = ({ adviser, onClose }) => {
    const [adviserTimeLogs, setAdviserTimeLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loginCount, setLoginCount] = useState(0); // State to hold login frequency
    const [totalDuration, setTotalDuration] = useState(0); // State to hold total duration

    const [selectedYear, setSelectedYear] = useState('all'); // Year filter
    const [selectedMonth, setSelectedMonth] = useState('all'); // Month filter
    const [selectedWeek, setSelectedWeek] = useState('all'); // Week filter

    useEffect(() => {
        const fetchAdviserTimeLogs = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/time-log/getAllTimelogsByAdviser/${adviser.uid}`);
                setAdviserTimeLogs(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch adviser time logs');
                console.error(err);
            }
        };

        fetchAdviserTimeLogs();
    }, [adviser.uid]);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
        setSelectedWeek('all'); // Reset the week when the month changes
    };

    const handleWeekChange = (event) => {
        setSelectedWeek(event.target.value);
    };

    // Filter logs based on selected year, month, and week
    const filteredTimeLogs = adviserTimeLogs.filter(log => {
        const logDate = new Date(log.loginTime);

        // Filter by year
        if (selectedYear !== 'all' && logDate.getFullYear() !== parseInt(selectedYear)) {
            return false;
        }

        // Filter by month
        if (selectedMonth !== 'all' && logDate.getMonth() + 1 !== parseInt(selectedMonth)) {
            return false;
        }

        // Filter by week (only apply if a month is selected)
        if (selectedMonth !== 'all' && selectedWeek !== 'all') {
            const weekOfMonth = Math.ceil(logDate.getDate() / 7); // Calculate the week number of the month
            if (weekOfMonth.toString() !== selectedWeek) {
                return false;
            }
        }

        return true;
    });

    // Recalculate total logins and total duration based on filtered logs
    const totalLogins = filteredTimeLogs.length;
    const totalDurationFiltered = filteredTimeLogs.reduce((acc, log) => acc + log.duration, 0);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>{adviser.firstname} {adviser.lastname}'s Time Logs</h2>
                <button className={styles.closeButton} onClick={onClose}>Close</button>

                {/* Filters */}
                <div className={styles.filters}>
                    <label>
                        Year:
                        <select value={selectedYear} onChange={handleYearChange}>
                            <option value="all">All</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                        </select>
                    </label>

                    <label>
                        Month:
                        <select value={selectedMonth} onChange={handleMonthChange}>
                            <option value="all">All</option>
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </label>

                    {/* Conditionally render the week filter if a month is selected */}
                    {selectedMonth !== 'all' && (
                        <label>
                            Week:
                            <select value={selectedWeek} onChange={handleWeekChange}>
                                <option value="all">All</option>
                                <option value="1">Week 1</option>
                                <option value="2">Week 2</option>
                                <option value="3">Week 3</option>
                                <option value="4">Week 4</option>
                            </select>
                        </label>
                    )}
                </div>

                {/* Display total login count and total duration */}
                <p><strong>Total Logins:</strong> {totalLogins}</p>
                <p><strong>Total Duration:</strong> {totalDurationFiltered} minute/s</p>

                <table className={styles.timeTable}>
                    <thead>
                        <tr>
                            <th>Login Time</th>
                            <th>Logout Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTimeLogs.map(log => (
                            <tr key={log.timelog_id}>
                                <td>{new Date(log.loginTime).toLocaleString()}</td>
                                <td>{log.logoutTime ? new Date(log.logoutTime).toLocaleString() : 'Not logged out yet'}</td>
                                <td>{log.duration} minute/s</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdviserTimeLogModal;
