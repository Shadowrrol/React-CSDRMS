import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './EditReportModal.module.css';

const EditReportModal = ({ reportId, onClose, refreshReports}) => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;

  const [reportData, setReportData] = useState({
    date: '',
    time: '',
    complaint: '',
    complainant: '',
    complete: false,
    received: '',
    viewedByAdviser: false,
    viewedBySso: false,
    studentId: '', // Store selected student ID
  });

  const [students, setStudents] = useState([]); // Store all students
  const [filteredStudents, setFilteredStudents] = useState([]); // For search results
  const [searchQuery, setSearchQuery] = useState(''); // Search term for filtering students
  const [showDropdown, setShowDropdown] = useState(false); // Show or hide dropdown

  // Fetch the report data and set it in the form
  useEffect(() => {
    if (reportId) {
      axios.get(`http://localhost:8080/report/getReport/${reportId}`)
        .then(response => {
          setReportData(response.data);
          setSearchQuery(response.data.student?.name || ''); // Set the current student name in the search field
        })
        .catch(error => console.error('Error fetching report:', error));
    }
  }, [reportId]);

  // Fetch students based on userType
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        let response;
        if (loggedInUser?.userType === 3) {
          response = await axios.get('http://localhost:8080/student/getAllStudentsByAdviser', {
            params: {
              section: loggedInUser.section,
              schoolYear: loggedInUser.schoolYear,
            },
          });
        } else {
          response = await axios.get('http://localhost:8080/student/getAllCurrentStudents');
        }
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    if (loggedInUser) {
      fetchStudents();
    }
  }, []);

  // Filter students based on search query
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredStudents([]); // Show no students if search query is empty
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

  // Handle input changes for the report data
  const handleInputChange = (e) => {
    setReportData({ ...reportData, [e.target.name]: e.target.value });
  };

  // Handle submitting the updated report
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reportData.date || !reportData.time || !reportData.complaint || !reportData.complainant || !reportData.received || !reportData.studentId) {
      alert('All fields are required.');
      return;
    }

    try {
      await axios.put(`http://localhost:8080/report/updateReport/${reportId}`, reportData);
      refreshReports(); // Refresh the report list after submission
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Failed to update the report.');
    }
  };

  // Handle selecting a student from the dropdown
  const handleSelectStudent = (student) => {
    setReportData({ ...reportData, studentId: student.id });
    setSearchQuery(`${student.sid} - ${student.name}`); // Update the search field with selected student's details
    setShowDropdown(false); // Hide dropdown after selection
  };

  // Handle clearing the student selection
  const handleClearSelection = () => {
    setReportData({ ...reportData, studentId: '' });
    setSearchQuery(''); // Clear the search query
    setShowDropdown(false); // Hide the dropdown
  };

  return (
    <div className={styles['edit-report-modal']}>
      <div className={styles['edit-report-modal-content']}>
        <h2>Edit Report</h2>

        <form onSubmit={handleSubmit}>
            {/* Student Search and Select Field */}
          <label>Student:</label>
          <div className={styles['edit-report-group']}>
            <input
              type="text"
              placeholder="Search student by name or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={!!reportData.studentId} // Disable input if a student is selected
              required
            />

            {/* Show "X" button when a student is selected */}
            {reportData.studentId && (
              <button className={styles.clearButton} onClick={handleClearSelection}>
                ✕
              </button>
            )}
          </div>

          {/* Only show dropdown and messages when no student is selected */}
          {!reportData.studentId && (
            <div>
              {/* Show filtered students only when search query is not empty */}
              {searchQuery && filteredStudents.length > 0 ? (
                <ul className={styles.dropdown}>
                  {filteredStudents.map((student) => (
                    <li key={student.id}
                      onClick={() => handleSelectStudent(student)}
                      className={styles.dropdownItem}>
                      {student.name} ({student.sid})
                    </li>
                  ))}
                </ul>
              ) : searchQuery && filteredStudents.length === 0 ? (
                <p className={styles.dropdown}>No students found.</p>
              ) : null }
            </div>
          )}

          {/* Date Field */}
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={reportData.date}
            onChange={handleInputChange}
            required
          />

          {/* Time Field */}
          <label>Time:</label>
          <input
            type="time"
            name="time"
            value={reportData.time}
            onChange={handleInputChange}
            required
          />

          {/* Complaint Field */}
          <label>Complaint:</label>
          <textarea
            name="complaint"
            placeholder="Complaint"
            value={reportData.complaint}
            onChange={handleInputChange}
            required
          />


          
          <button className={styles['edit-report-button']} type="submit">Update Report</button>
          <button  onClick={onClose} className={`${styles['edit-report-button']} ${styles['edit-report-button-cancel']}`}>Cancel</button>
        </form>

        
      </div>
    </div>
  );
};

export default EditReportModal;
