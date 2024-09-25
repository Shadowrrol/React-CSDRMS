import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Navigation.module.css'; // Using the original Navigation.module.css
import AddReportModal from './AddReportModal'; // Import the modal component

import AssessmentIcon from '@mui/icons-material/Assessment';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PostAddIcon from '@mui/icons-material/PostAdd';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SchoolIcon from '@mui/icons-material/School';

const Reports = () => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to handle modal visibility

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
    try {
      const response = await axios.get('http://localhost:8080/report/getAllReports');
      const fetchedReports = response.data;

      // If loggedInUser is userType 1 (SSO), update received field for any report where received is null
      if (loggedInUser?.userType === 1) {
        fetchedReports.forEach(async (report) => {
          if (!report.received) {
            // Update the 'received' field with the current date for SSO users
            const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
            await axios.put(`http://localhost:8080/report/updateReceived/${report.reportId}`, { received: currentDate });
          }
        });
      }

      setReports(fetchedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
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
    }
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

  // Show or hide the modal
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="Logo" className={styles['sidebar-logo']} />
        {loggedInUser && loggedInUser.userType !== 5 && createSidebarLink('/record', 'Record', AssessmentIcon)}
        {loggedInUser && loggedInUser.userType !== 5 && loggedInUser.userType !== 6 && createSidebarLink('/student', 'Student', SchoolIcon)}
        {loggedInUser && loggedInUser.userType !== 5 && loggedInUser.userType !== 6 && createSidebarLink('/notification', 'Notification', NotificationsActiveIcon)}
        {loggedInUser && loggedInUser.userType !== 1 && loggedInUser.userType !== 5 && loggedInUser.userType !== 6 && createSidebarLink('/feedback', 'Feedback', RateReviewIcon)}
        {createSidebarLink('/report', 'Report', PostAddIcon)}
        {loggedInUser && loggedInUser.userType !== 3 && loggedInUser.userType !== 5 && loggedInUser.userType !== 6 && createSidebarLink('/sanctions', 'Sanctions', LocalPoliceIcon)}
        {loggedInUser && loggedInUser.userType !== 5 && loggedInUser.userType !== 6 && createSidebarLink('/Followup', 'Followups', PendingActionsIcon)}
        <button className={styles['logoutbtn']} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Reports section */}
      <div>
        <h2>Reports List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Complaint</th>
              <th>Complainant</th>
              <th>Adviser</th>
              <th>Received</th>
              <th>Complete</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.reportId}>
                <td>{report.id}</td>
                <td>{report.date}</td>
                <td>{report.time}</td>
                <td>{report.complaint}</td>
                <td>{report.complainant}</td>
                <td>{report.adviser}</td>
                <td>{report.received ? report.received : 'Pending'}</td>
                <td>{report.complete ? 'Yes' : 'No'}</td>
                <td>
                  {!report.complete && (
                    <button onClick={() => handleComplete(report.reportId)}>Complete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Button to open the modal */}
        <button onClick={toggleModal}>Create Report</button>

        {/* Modal for creating a new report */}
        {showModal && (
          <AddReportModal 
            onClose={toggleModal} 
            refreshReports={fetchReports} 
          />
        )}
      </div>
    </div>
  );
};

export default Reports;
