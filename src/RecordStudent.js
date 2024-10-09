import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecordFilter from './RecordFilter'; // Import RecordFilter component
import AddRecordModal from './RecordStudentAddModal'; // Import AddRecordModal component
import ImportModal from './RecordStudentImportModal'; // Import ImportModal component
import styles from './Record.module.css'; // Importing CSS module
import formStyles from './GlobalForm.module.css'; // Importing GlobalForm styles
import tableStyles from './GlobalTable.module.css'; // Importing GlobalForm styles

const RecordStudent = ({ loggedInUser, schoolYears, grades, students, setStudents }) => {
  const [filteredStudents, setFilteredStudents] = useState([]); // For filtered search results
  const [searchQuery, setSearchQuery] = useState(''); // Hold the search term
  const [selectedStudent, setSelectedStudent] = useState(null); // Hold the selected student
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(''); 
  const [selectedWeek, setSelectedWeek] = useState('');
  const [showAddRecordModal, setShowAddRecordModal] = useState(false); // Modal visibility state
  const [showImportModal, setShowImportModal] = useState(false); // Control ImportModal visibility

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
    if (searchQuery === '') {
      setFilteredStudents([]); // Show no students when search query is empty
    } else {
      const lowercasedSearchTerm = searchQuery.toLowerCase();
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(lowercasedSearchTerm) ||
          student.sid.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

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

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    fetchStudentRecords(student.sid); // Fetch records for the selected student
  };

  const getWeekNumber = (date) => {
    const dayOfMonth = date.getDate();
    return Math.ceil(dayOfMonth / 7);
  };

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
    <>
      <div className={styles.TitleContainer}>
        <h2 className={styles.RecordTitle}>Student Overview</h2> 
      </div>      
      <div className={styles['triple-container']}>
        {/* Display selected student details */}
        <div className={styles['details-container']}>
          <label>Details: </label>
          <div><strong>ID Number:</strong> {selectedStudent?.sid || 'N/A'}</div>
          <div><strong>Name:</strong> {selectedStudent?.name || 'N/A'}</div>
          <div><strong>Grade:</strong> {selectedStudent?.grade || 'N/A'}</div>
          <div><strong>Section:</strong> {selectedStudent?.section || 'N/A'}</div>
          <div><strong>Gender:</strong> {selectedStudent?.gender || 'N/A'}</div>
          {/*<div><strong>Adviser:</strong> {selectedStudent?.adviser || 'N/A'}</div> */}
        </div>

        {/* Search Bar for Students */}
        <div className={styles['search-container']}>
          <label htmlFor="studentSearch">Search: </label>
          <input
            type="text"
            id="studentSearch"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter student name or ID"
          />
          {/* Only show the student list if the searchQuery is not empty and filtered students exist */}
          {searchQuery && (
            <div>
              {filteredStudents.length > 0 ? (
                <ul className={formStyles['global-dropdown']}>
                  {filteredStudents.map((student) => (
                    <li
                      key={student.sid}
                      onClick={() => handleStudentSelect(student)}
                      className={formStyles['global-dropdown-item']}>
                      {student.name} ({student.sid})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={formStyles['global-dropdown']}>No students found.</p>
              )}
            </div>
          )}
        </div>

        {/* Button Groups */}
        <div className={styles['buttons-container']}>
          <label>Action Buttons: </label>
          <div className={formStyles['global-buttonGroup']}>
            {/* Import Modal */}
            {showImportModal && ( // Conditionally render ImportModal based on showImportModal state
              <ImportModal
                onClose={() => setShowImportModal(false)}
                schoolYears={schoolYears}
              />
            )}    
            {/* Button to open Import Modal */}
            {loggedInUser?.userType !== 3 && (
              <button onClick={() => setShowImportModal(true)} className={formStyles['global-button']}>
                Import Student Data
              </button>
            )} 

             {/* Add Record Modal */}
             {showAddRecordModal && (
              <AddRecordModal
                student={selectedStudent}
                onClose={() => setShowAddRecordModal(false)}
              />
            )}        
            {/* Add Record Button */}
            {selectedStudent && loggedInUser?.userType === 1 && (
              <button
                className={formStyles['global-button']}
                onClick={() => setShowAddRecordModal(true)}
              >
                Add Record
              </button>
            )}           
          </div>
        </div>
      </div>

      {/* Use RecordFilter component to filter by school year, month, week */}
      {selectedStudent && (
        <RecordFilter
          schoolYears={schoolYears}
          grades={grades}
          loggedInUser={loggedInUser}
          selectedSchoolYear={selectedSchoolYear}
          setSelectedSchoolYear={setSelectedSchoolYear}
          selectedGrade={null} // Pass null or undefined since we don't want grade filter
          setSelectedGrade={() => {}} // Empty setter for grade
          selectedSection={null} // Pass null or undefined since we don't want section filter
          setSelectedSection={() => {}} // Empty setter for section
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          showGradeAndSection={false} // Hide grade and section filters
        />
      )}

      {/* Display records if student is selected */}
      {selectedStudent && (
        <>
          <h2>Total Frequency of Monitored Records</h2>
          <div className={tableStyles['table-container']}>
            <table className={tableStyles['global-table']}>
              <thead>
                <tr>
                  {monitoredRecordsList.map((monitoredRecord, index) => (
                    <th key={index}>{monitoredRecord}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {monitoredRecordsList.map((monitoredRecord, index) => (
                    <td key={index}>{frequencies[monitoredRecord]}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Detailed Records</h2>
          <div className={tableStyles['table-container']}>

            <table className={tableStyles['global-table']}>
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
          </div>
        </>
      )}
    </>
  );
};

export default RecordStudent;
