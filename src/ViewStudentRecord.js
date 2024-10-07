import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ViewStudentRecord.module.css'; // Importing CSS module

const ViewStudentRecord = () => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;

  const [students, setStudents] = useState([]); // Hold all students
  const [filteredStudents, setFilteredStudents] = useState([]); // For filtered search results
  const [searchTerm, setSearchTerm] = useState(''); // Hold the search term
  const [selectedStudent, setSelectedStudent] = useState(null); // Hold the selected student
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
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
    { value: '5', label: 'Week 5' },
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

  // Fetch all students when the component mounts
  useEffect(() => {
    fetchAllStudents();
    if (loggedInUser?.userType !== 3) {
      fetchSchoolYears(); // Only fetch school years if userType !== 3
    }
  }, []);

  // Fetch all current students from the API
  const fetchAllStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/student/getAllCurrentStudents');
      setStudents(response.data);
      setFilteredStudents(response.data); // By default, show all students
    } catch (error) {
      console.error('Error fetching students:', error);
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

  // Fetch student records based on the selected student
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

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter students by name
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  // Handle student selection
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    fetchStudentRecords(student.sid); // Fetch records for the selected student
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

      {/* Search Bar for Students */}
      <div className={styles['search-container']}>
        <label htmlFor="studentSearch">Search Student by Name:</label>
        <input
          type="text"
          id="studentSearch"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Enter student name"
        />
        {/* Display student list if not loading */}
        {filteredStudents.length > 0 && (
          <ul className={styles['student-list']}>
            {filteredStudents.map((student) => (
              <li
                key={student.sid}
                onClick={() => handleStudentSelect(student)}
                className={styles['student-item']}
              >
                {student.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Display selected student details */}
      {selectedStudent && (
        <div className={styles['student-details']}>
          <p><strong>Name:</strong> {selectedStudent.name}</p>
          <p><strong>Grade:</strong> {selectedStudent.grade}</p>
          <p><strong>Section:</strong> {selectedStudent.section}</p>
          <p><strong>Gender:</strong> {selectedStudent.gender}</p>
        </div>
      )}

      {/* Filter Section */}
      {selectedStudent && (
        <div className={styles['filter-container']}>
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
      )}

      {loading ? (
        <p>Loading student records...</p>
      ) : (
        <>
          {/* Frequency Table */}
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

          {/* Detailed Records Table */}
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
