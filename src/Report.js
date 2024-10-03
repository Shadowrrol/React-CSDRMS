import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import navStyles from './Navigation.module.css';
import Navigation from './Navigation'; // Importing the updated Navigation component
import AddReportModal from './AddReportModal';
import AddSuspensionModal from './SSO/AddSuspensionModal';
import styles from './Report.module.css';

const Reports = () => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [suspensions, setSuspensions] = useState([]); // Store all suspensions here
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSuspensionModal, setShowSuspensionModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch reports and suspensions when the component is mounted
  useEffect(() => {
    fetchReports();
    fetchSuspensions(); // Fetch all suspensions once
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authToken) {
      navigate('/login');
    }
  }, [authToken, navigate]);

  // Fetch all suspensions
  const fetchSuspensions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/suspension/getAllSuspensions');
      setSuspensions(response.data);
    } catch (error) {
      console.error('Error fetching suspensions:', error);
      alert('Failed to fetch suspensions. Please try again later.');
    }
  };

  // Fetch reports based on user type
  const fetchReports = async () => {
    setLoading(true);
    try {
      let response;

      if (loggedInUser?.userType === 3) {
        // Adviser user, fetch reports based on their section and school year
        response = await axios.get('http://localhost:8080/report/getAllReportsForAdviser', {
          params: {
            section: loggedInUser.section,
            schoolYear: loggedInUser.schoolYear,
          },
        });
      } else if (loggedInUser?.userType === 5) {
        // Complainant user, fetch reports based on their username
        response = await axios.get('http://localhost:8080/report/getAllReportsByComplainant', {
          params: {
            complainant: loggedInUser.username,
          },
        });
      } else {
        // For all other user types, fetch all reports
        response = await axios.get('http://localhost:8080/report/getAllReports');
      }

      const fetchedReports = response.data;

      // If loggedInUser is userType 1 (SSO), update the received field for any report where received is null
      if (loggedInUser?.userType === 1) {
        const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const updates = fetchedReports
          .filter((report) => !report.received) // Find reports where `received` is null
          .map((report) =>
            axios.put(`http://localhost:8080/report/updateReceived/${report.reportId}`, { received: currentDate })
          );

        // Wait for all the received field updates to finish
        await Promise.all(updates);

        // Refetch the reports to reflect the updated received status
        const updatedResponse = await axios.get('http://localhost:8080/report/getAllReports');
        setReports(updatedResponse.data); // Update the state with the latest reports
      } else {
        setReports(fetchedReports); // Set fetched reports for non-SSO users
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Failed to fetch reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Check if a report is suspended
  const isReportSuspended = (reportId) => {
    return suspensions.some((suspension) => suspension.reportId === reportId);
  };

  // Handle completing a report
  const handleComplete = async (reportId) => {
    try {
      await axios.put(`http://localhost:8080/report/complete/${reportId}`);
      fetchReports(); // Refetch the reports after completing
    } catch (error) {
      console.error('Error completing the report:', error);
      alert('Failed to complete the report.');
    }
  };

  // Handle showing suspension modal for a specific report
  const handleAddSuspension = (reportId) => {
    setSelectedReportId(reportId);
    setShowSuspensionModal(true);
  };

  // Show or hide the report modal
  const toggleReportModal = () => {
    setShowReportModal(!showReportModal);
  };

  // Show or hide the suspension modal
  const toggleSuspensionModal = () => {
    setShowSuspensionModal(!showSuspensionModal);
    setSelectedReportId(null);
  };

  return (
    <div className={navStyles.wrapper}>
      <Navigation loggedInUser={loggedInUser} />

      {/* Reports section */}
      <div className={navStyles.content}>
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
                {loggedInUser?.userType === 1 && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.reportId}>
                  <td>{report.date}</td>
                  <td>{report.time}</td>
                  <td>{report.complaint}</td>
                  <td>{report.complainant}</td>
                  <td>{report.student.name}</td>
                  <td>{report.adviser.firstname} {report.adviser.lastname}</td>
                  <td>{report.received ? report.received : 'Pending'}</td>
                  <td>{report.complete ? 'Yes' : 'No'}</td>
                  {loggedInUser?.userType === 1 && (
                    <td>
                      <button
                        className={styles.reportButton}
                        onClick={() => handleComplete(report.reportId)}
                        disabled={report.complete}
                      >
                        Complete
                      </button>
                      <button
                        className={styles.reportButton}
                        onClick={() => handleAddSuspension(report.reportId)}
                        disabled={isReportSuspended(report.reportId)} // Disable if already suspended
                      >
                        {isReportSuspended(report.reportId) ? 'Suspended' : 'Add Suspension'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button className={styles.reportButton} onClick={toggleReportModal}>
          Create Report
        </button>

        {showReportModal && (
          <AddReportModal
            key="addReportModal"
            onClose={toggleReportModal}
            refreshReports={fetchReports}
          />
        )}

        {showSuspensionModal && (
          <AddSuspensionModal
            key="addSuspensionModal"
            onClose={toggleSuspensionModal}
            reportId={selectedReportId}
            refreshReports={fetchReports}
            refreshSuspensions={fetchSuspensions} // Pass the fetchSuspensions function
          />
        )}
      </div>
    </div>
  );
};

export default Reports;
