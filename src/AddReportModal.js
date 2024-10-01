import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AddReportModal.module.css';

const AddReportModal = ({ onClose, refreshReports }) => {
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
        const response = await axios.get('http://localhost:8080/student/getAllCurrentStudents');
        setStudents(response.data);
        setFilteredStudents(response.data); // Set filtered students initially to all students
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

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

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Create New Report</h2>

        {/* Student Search and Select Field */}
        <div className={styles.studentSearchContainer}>
          <input
            type="text"
            placeholder="Search student by name or ID"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setShowDropdown(true)} // Show dropdown when the field is focused
          />

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
        <div>
          <textarea
            type="text"
            name="complaint"
            placeholder="Complaint"
            value={newReport.complaint}
            onChange={handleInputChange}
          />
        </div>

        {/* Modal Actions */}
        <div className={styles.modalActions}>
          <button onClick={handleCreateReport}>Create Report</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddReportModal;
