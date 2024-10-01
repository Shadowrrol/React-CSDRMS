import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './ViewStudentRecord.module.css'; // Importing CSS module

const ViewStudentRecord = () => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;

  const { id } = useParams(); // Get the student ID from the URL
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null); // State to hold student details
  const [schoolYears, setSchoolYears] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(''); // State for the selected week

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

  const weeks = [
    { value: '1', label: 'Week 1' },
    { value: '2', label: 'Week 2' },
    { value: '3', label: 'Week 3' },
    { value: '4', label: 'Week 4' },
    { value: '5', label: 'Week 5' }, // In case some months have a 5th week
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

  // Fetch student details on mount
  useEffect(() => {
    fetchStudentDetails();
    if (loggedInUser?.userType !== 3) {
      fetchSchoolYears(); // Only fetch school years if userType !== 3
    }
  }, []);

  // Fetch student details from the API
  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/student/getCurrentStudent/${id}`);
      setStudent(response.data); // Set the student data to the state
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  // Fetch student records when student details (specifically student.sid) are available
  useEffect(() => {
    if (student && student.sid) {
      if (loggedInUser?.userType === 3) {
        // Fetch records for userType === 3 (Adviser)
        fetchStudentRecordsByAdviser(student.sid, loggedInUser.section);
      } else {
        // Fetch regular student records
        fetchStudentRecords(student.sid);
      }
    }
  }, [student]);

  // Fetch student records for general users from the API
  const fetchStudentRecords = async (sid) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/student-record/getStudentRecords/${sid}`);
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching student records:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch student records by adviser (for userType 3)
  const fetchStudentRecordsByAdviser = async (sid, section) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/student-record/getStudentRecordsByAdviser`, {
        params: {
          sid: sid,
          section: section,
          schoolYear: loggedInUser.schoolYear, // Assuming loggedInUser has schoolYear info
        },
      });
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records by adviser:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch school years from the API (only for non-adviser users)
  const fetchSchoolYears = async () => {
    try {
      const response = await axios.get('http://localhost:8080/schoolYear/getAllSchoolYears');
      setSchoolYears(response.data);
    } catch (error) {
      console.error('Error fetching school years:', error);
    }
  };

  // Helper function to calculate the week number of a date
  const getWeekNumber = (date) => {
    const dayOfMonth = date.getDate();
    return Math.ceil(dayOfMonth / 7);
  };

  // Filter the records by selected school year, month, and week
  const filteredRecords = records.filter((record) => {
    const recordMonth = new Date(record.record_date).getMonth() + 1;
    const formattedMonth = recordMonth < 10 ? `0${recordMonth}` : `${recordMonth}`;

    const recordWeek = getWeekNumber(new Date(record.record_date));

    return (
      (!selectedSchoolYear || record.student.schoolYear === selectedSchoolYear) &&
      (!selectedMonth || formattedMonth === selectedMonth) &&
      (!selectedWeek || recordWeek === parseInt(selectedWeek, 10))
    );
  });

  // Count the frequency of each monitored record
  const countFrequency = () => {
    const frequencies = monitoredRecordsList.reduce((acc, record) => {
      acc[record] = 0; // Initialize each monitored record with 0
      return acc;
    }, {});

    filteredRecords.forEach((record) => {
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

      {/* Display Student Details */}
      {student ? (
        <div className={styles['student-details']}>
          <p><strong>Name:</strong> {student.name} </p>
          <p><strong>Grade:</strong> {student.grade}</p>
          <p><strong>Section:</strong> {student.section}</p>
          <p><strong>Gender:</strong> {student.gender}</p>
        </div>
      ) : (
        <p>Loading student details...</p>
      )}

      {/* Filter Section */}
      <div className={styles['filter-container']}>
        {/* Hide the school year filter for userType 3 */}
        {loggedInUser?.userType !== 3 && (
          <>
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
          </>
        )}

        <label htmlFor="monthFilter" style={{ marginLeft: '20px' }}>Filter by Month:</label>
        <select
          id="monthFilter"
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            setSelectedWeek(''); // Reset week filter when month changes
          }}
        >
          <option value="">All Months</option>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>

        {/* Week filter: Only show if a month is selected */}
        {selectedMonth && (
          <>
            <label htmlFor="weekFilter" style={{ marginLeft: '20px' }}>Filter by Week:</label>
            <select
              id="weekFilter"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
            >
              <option value="">All Weeks</option>
              {weeks.map((week) => (
                <option key={week.value} value={week.value}>
                  {week.label}
                </option>
              ))}
            </select>
          </>
        )}
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
                <th>Grade</th>
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
                  <td>{record.student.grade}</td>
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
