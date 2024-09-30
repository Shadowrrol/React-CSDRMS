import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './ViewStudentRecord.module.css'; // Importing CSS module

const ViewStudentRecord = () => {
  const { id } = useParams(); // Get the student ID from the URL
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schoolYears, setSchoolYears] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const monitoredRecordsList = [
    'Absent',
    'Tardy',
    'Cutting Classes',
    'Improper Uniform',
    'Offense',
    'Misbehavior',
    'Clinic',
    'Sanction',
  ];

  useEffect(() => {
    fetchStudentRecords();
    fetchSchoolYears();
  }, []);

  // Fetch student records from the API
  const fetchStudentRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/student-record/getStudentRecords/${id}`);
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching student records:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch school years from the API
  const fetchSchoolYears = async () => {
    try {
      const response = await axios.get('http://localhost:8080/schoolYear/getAllSchoolYears');
      setSchoolYears(response.data);
    } catch (error) {
      console.error('Error fetching school years:', error);
    }
  };

  // Filter the records by selected school year and month
  const filteredRecords = records.filter((record) => {
    const recordMonth = new Date(record.record_date).getMonth() + 1;
    const formattedMonth = recordMonth < 10 ? `0${recordMonth}` : `${recordMonth}`;
    return (
      (!selectedSchoolYear || record.student.schoolYear === selectedSchoolYear) &&
      (!selectedMonth || formattedMonth === selectedMonth)
    );
  });

  // Count the frequency of each monitored record
  const countFrequency = () => {
    const frequencies = monitoredRecordsList.reduce((acc, record) => {
      acc[record] = 0; // Initialize each monitored record with 0
      return acc;
    }, {});

    filteredRecords.forEach(record => {
      if (frequencies[record.monitored_record] !== undefined) {
        frequencies[record.monitored_record]++;
      }
    });
    return frequencies;
  };

  const frequencies = countFrequency();

  return (
    <div className={styles['view-student-record-wrapper']}>
      <h2 className={styles['view-student-record-header']}>Student Record Overview</h2>

      {/* Filter Section */}
      <div className={styles['filter-container']}>
        <label htmlFor="schoolYearFilter">Filter by School Year:</label>
        <select
          id="schoolYearFilter"
          value={selectedSchoolYear}
          onChange={(e) => setSelectedSchoolYear(e.target.value)}
        >
          <option value="">All School Years</option>
          {schoolYears.map((year) => (
            <option key={year.schoolYear_ID} value={year.schoolYear}>
              {year.schoolYear}
            </option>
          ))}
        </select>

        <label htmlFor="monthFilter" style={{ marginLeft: '20px' }}>Filter by Month:</label>
        <select
          id="monthFilter"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading student records...</p>
      ) : (
        <>
          {/* Table for Total Frequency of Monitored Records */}
          <h3 className={styles['view-student-record-subheader']}>Total Frequency of Monitored Records</h3>
          <table className={styles['view-student-record-table']}>
            <thead>
              <tr>
                <th>Monitored Record</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>
              {monitoredRecordsList.map((monitoredRecord) => (
                <tr key={monitoredRecord}>
                  <td>{monitoredRecord}</td>
                  <td>{frequencies[monitoredRecord]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table for Individual Records */}
          <h3 className={styles['view-student-record-subheader']}>Detailed Records</h3>
          <table className={styles['view-student-record-table']}>
            <thead>
              <tr>
                <th>Record ID</th>
                <th>SID</th>
                <th>Record Date</th>
                <th>Incident Date</th>
                <th>Time</th>
                <th>Monitored Record</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.recordId}>
                  <td>{record.recordId}</td>
                  <td>{record.sid}</td>
                  <td>{record.record_date}</td>
                  <td>{record.incident_date}</td>
                  <td>{record.time}</td>
                  <td>{record.monitored_record}</td>
                  <td>{record.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ViewStudentRecord;
