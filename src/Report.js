import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Navigation.module.css'; // Using the original Navigation.module.css
import AddReportModal from './AddReportModal'; // Import the report modal component
import AddSuspensionModal from './SSO/AddSuspensionModal'; // Import the suspension modal component

import AssessmentIcon from '@mui/icons-material/Assessment';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PostAddIcon from '@mui/icons-material/PostAdd';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

const Reports = () => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false); // State to handle report modal visibility
  const [showSuspensionModal, setShowSuspensionModal] = useState(false); // State to handle suspension modal visibility
  const [selectedReportId, setSelectedReportId] = useState(null); // Store the reportId for suspension
  const [loading, setLoading] = useState(false); // Loading state for fetching reports

  // Fetch reports when component is mounted
  useEffect(() => {
    fetchReports();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authToken) {
      navigate('/login');
    }
  }, [authToken, navigate]);

  // Fetch all reports from the backend
  const fetchReports = async () => {
    setLoading(true); // Set loading state
    try {
      const response = await axios.get('http://localhost:8080/report/getAllReports');
      const fetchedReports = response.data;

      // If loggedInUser is userType 1 (SSO), update received field for any report where received is null
      if (loggedInUser?.userType === 1) {
        const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const updates = fetchedReports
          .filter((report) => !report.received)
          .map((report) =>
            axios.put(`http://localhost:8080/report/updateReceived/${report.reportId}`, { received: currentDate })
          );

        // Wait for all updates to finish
        await Promise.all(updates);
      }

      setReports(fetchedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Failed to fetch reports. Please try again later.'); // Add user feedback
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  // Handle completing a report
  const handleComplete = async (reportId) => {
    try {
      await axios.put(`http://localhost:8080/report/complete/${reportId}`);
      // Refetch the reports after completing
      fetchReports();
    } catch (error) {
      console.error('Error completing the report:', error);
      alert('Failed to complete the report.'); // Add user feedback
    }
  };

  // Handle showing suspension modal for a specific report
  const handleAddSuspension = (reportId) => {
    setSelectedReportId(reportId); // Set the reportId for the suspension
    setShowSuspensionModal(true);  // Show the suspension modal
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  // Sidebar link generator
  const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={styles['styled-link']}>
      <IconComponent className={styles.icon} />
      <span className={styles['link-text']}>{text}</span>
    </Link>
  );

  // Show or hide the report modal
  const toggleReportModal = () => {
    setShowReportModal(!showReportModal);
  };

  // Show or hide the suspension modal
  const toggleSuspensionModal = () => {
    setShowSuspensionModal(!showSuspensionModal);
    setSelectedReportId(null); // Reset the selected reportId when closing the modal
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="Logo" className={styles['sidebar-logo']} />
        {loggedInUser && loggedInUser.userType !== 5 && createSidebarLink('/record', 'Record', AssessmentIcon)}
        {loggedInUser && loggedInUser.userType !== 5 && loggedInUser.userType !== 6 && createSidebarLink('/student', 'Student', SchoolIcon)}
        {loggedInUser && loggedInUser.userType !== 5 && loggedInUser.userType !== 6 && createSidebarLink('/notification', 'Notification', NotificationsActiveIcon)}
        {createSidebarLink('/report', 'Report', PostAddIcon)}
        {loggedInUser.userType === 1 && createSidebarLink("/timeLog", "Time Log", AccessTimeFilledIcon)}
        <button className={styles['logoutbtn']} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Reports section */}
      <div>
        <h2>Reports List</h2>
        {loading ? (
          <p>Loading reports...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Complaint</th>
                <th>Complainant</th>
                <th>Student</th>
                <th>Adviser</th>
                <th>Received</th>
                <th>Complete</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.reportId}>
                  <td>{report.date}</td>
                  <td>{report.time}</td>
                  <td>{report.complaint}</td>
                  <td>{report.complainant}</td>
                  <td>{report.student.firstname} {report.student.lastname}</td>
                  <td>{report.adviser.firstname} {report.adviser.lastname}</td>
                  <td>{report.received ? report.received : 'Pending'}</td>
                  <td>{report.complete ? 'Yes' : 'No'}</td>
                  <td>
                    <button onClick={() => handleComplete(report.reportId)}>Complete</button>
                    <button onClick={() => handleAddSuspension(report.reportId)}>Add Suspension</button> {/* Add Suspension Button */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Button to open the report modal */}
        {loggedInUser?.userType === 1 && (
          <button onClick={toggleReportModal}>Create Report</button>
        )}

        {/* Modal for creating a new report */}
        {showReportModal && (
          <AddReportModal 
            key="addReportModal" 
            onClose={toggleReportModal} 
            refreshReports={fetchReports} 
          />
        )}

        {/* Modal for adding a suspension */}
        {showSuspensionModal && (
          <AddSuspensionModal 
            key="addSuspensionModal" 
            onClose={toggleSuspensionModal} 
            reportId={selectedReportId}  // Pass the reportId to the suspension modal
            refreshReports={fetchReports} 
          />
        )}
      </div>
    </div>
  );
};

export default Reports;
