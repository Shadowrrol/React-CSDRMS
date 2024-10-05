import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ReportModal.module.css'; // Correctly importing the styles

const ReportModal = ({ onClose, refreshReports }) => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;

  const [newReport, setNewReport] = useState({
    complaint: '',
    studentId: '',
  });

  const [students, setStudents] = useState([]); // State for holding the list of students
  const [filteredStudents, setFilteredStudents] = useState([]); // State for holding filtered student results
  const [searchQuery, setSearchQuery] = useState(''); // State for handling the search query
  const [showDropdown, setShowDropdown] = useState(false); // State for showing/hiding dropdown

  // Fetch the list of students when the modal opens
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        let response;
        
        // Check if usertype is 3 (Adviser)
        if (loggedInUser.userType === 3) {
          // Fetch students by adviser's section and school year
          response = await axios.get('http://localhost:8080/student/getAllStudentsByAdviser', {
            params: {
              section: loggedInUser.section, // Pass section from logged in user
              schoolYear: loggedInUser.schoolYear, // Pass schoolYear from logged in user
            },
          });
        } else {
          // Default API call for other user types
          response = await axios.get('http://localhost:8080/student/getAllCurrentStudents');
        }

        setStudents(response.data);
        setFilteredStudents(response.data); // Set filtered students initially to all students
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [loggedInUser]);

  // Handle input changes for the form
  const handleInputChange = (e) => {
    setNewReport({ ...newReport, [e.target.name]: e.target.value });
  };

  // Handle creating a new report
  const handleCreateReport = async () => {
    try {
      // Automatically set date, time, and complainant from logged-in user
      const reportData = {
        ...newReport,
        date: new Date().toISOString().split('T')[0], // Automatically set today's date
        time: new Date().toLocaleTimeString(), // Automatically set current time
        complainant: loggedInUser.username, // Set the logged-in user's username as the complainant
      };

      await axios.post('http://localhost:8080/report/insertReport', reportData);
      refreshReports(); // Refresh the reports list after submission
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  // Handle search and filter students
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchQuery(searchValue);

    // Filter students based on the search query
    const filtered = students.filter(
      (student) =>
        student.firstname.toLowerCase().includes(searchValue) ||
        student.lastname.toLowerCase().includes(searchValue) ||
        student.sid.toLowerCase().includes(searchValue)
    );

    setFilteredStudents(filtered);
    setShowDropdown(true); // Show dropdown when typing
  };

  // Handle student selection
  const handleSelectStudent = (student) => {
    setNewReport({ ...newReport, studentId: student.id });
    setSearchQuery(`${student.sid} - ${student.name}`); // Update the search field with selected student's details
    setShowDropdown(false); // Hide dropdown after selection
  };

  // Handle clearing the student selection
  const handleClearSelection = () => {
    setNewReport({ ...newReport, studentId: '' });
    setSearchQuery(''); // Clear the search query
    setShowDropdown(false); // Hide the dropdown
  };

  return (
    <div className={styles['report-modal-overlay']}>
      <div className={styles['report-modal-content']}>

        <h2>Create New Report</h2>

        {/* Student Search and Select Field */}
        <div className={styles['report-container']}>
            <div className={styles.searchWrapper}>
                <div className={styles['report-group']}>
                    <label>Student: </label>
                    <input  
                    className={styles['report-input']}
                    type="student"
                    placeholder="Search student by name or ID"
                    value={searchQuery}
                    onChange={handleSearch}
                    onFocus={() => setShowDropdown(true)} // Show dropdown when the field is focused
                    disabled={!!newReport.studentId} // Disable input if a student is selected
                    />

                    {/* Show "X" button when a student is selected */}
                    {newReport.studentId && (
                    <button className={styles.clearButton} onClick={handleClearSelection}>
                      ✕
                    </button>
                    )}
                </div>
            </div>

            {/* Dropdown list for filtered students */}
            {showDropdown && filteredStudents.length > 0 && (                
                <ul className={styles.dropdown}>
                {filteredStudents.map((student) => (
                    <li
                    key={student.id}
                    onClick={() => handleSelectStudent(student)}
                    className={styles.dropdownItem}
                    >
                    {student.sid} - {student.name}
                    </li>
                ))}
                </ul>
            )}
        </div>

        {/* Complaint Field */}
        <div className={styles['report-group']}>
        <label>Complaint: </label>                
        <textarea
            className={styles['report-modal-textarea']} // Apply the new CSS class here
            name="complaint"
            placeholder="Complaint"
            value={newReport.complaint}
            onChange={handleInputChange}
        />
        </div>


        <div className={styles['report-buttonGroup']}>
          <button onClick={handleCreateReport} className={styles['report-button']}>Create</button>
          <button onClick={onClose} className={`${styles['report-button']} ${styles['report-button-cancel']}`}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
