import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import navStyles from './Navigation.module.css';
import tableStyles from './GlobalTable.module.css';
import Navigation from './Navigation'; // Importing the updated Navigation component
import ReportModal from './ReportModal';
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
  const [selectedReportStatus, setSelectedReportStatus] = useState({ completed: false, suspended: false });

  useEffect(() => {
    fetchReports();
    fetchSuspensions(); // Fetch all suspensions once
  }, []);

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
    }
  }, [authToken, navigate]);

  const fetchSuspensions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/suspension/getAllSuspensions');
      setSuspensions(response.data);
    } catch (error) {
      console.error('Error fetching suspensions:', error);
      alert('Failed to fetch suspensions. Please try again later.');
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      let response;

      if (loggedInUser?.userType === 3) {
        response = await axios.get('http://localhost:8080/report/getAllReportsForAdviser', {
          params: {
            section: loggedInUser.section,
            schoolYear: loggedInUser.schoolYear,
          },
        });
      } else if (loggedInUser?.userType === 5) {
        response = await axios.get('http://localhost:8080/report/getAllReportsByComplainant', {
          params: {
            complainant: loggedInUser.username,
          },
        });
      } else {
        response = await axios.get('http://localhost:8080/report/getAllReports');
      }

      const fetchedReports = response.data;

      if (loggedInUser?.userType === 1) {
        const currentDate = new Date().toISOString().split('T')[0]; 
        const updates = fetchedReports
          .filter((report) => !report.received)
          .map((report) =>
            axios.put(`http://localhost:8080/report/updateReceived/${report.reportId}`, { received: currentDate })
          );

        await Promise.all(updates);
        const updatedResponse = await axios.get('http://localhost:8080/report/getAllReports');
        setReports(updatedResponse.data); 
      } else {
        setReports(fetchedReports); 
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Failed to fetch reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const isReportSuspended = (reportId) => {
    return suspensions.some((suspension) => suspension.reportId === reportId);
  };

  const handleComplete = async (reportId) => {
    try {
      await axios.put(`http://localhost:8080/report/complete/${reportId}`);
      fetchReports(); 
    } catch (error) {
      console.error('Error completing the report:', error);
      alert('Failed to complete the report.');
    }
  };

  const handleAddSuspension = (reportId) => {
    setSelectedReportId(reportId);
    setShowSuspensionModal(true);
  };

  const toggleReportModal = () => {
    setShowReportModal(!showReportModal);
  };

  const toggleSuspensionModal = () => {
    setShowSuspensionModal(!showSuspensionModal);
    setSelectedReportId(null);
  };

  const handleRowClick = (report) => {
    setSelectedReportId(report.reportId);
    // Update the selected report's status
    setSelectedReportStatus({
      completed: report.complete,
      suspended: isReportSuspended(report.reportId)
    });
  };

  return (
    <div className={navStyles.wrapper}>
      <Navigation loggedInUser={loggedInUser} />

      <div className={navStyles.content}>
        <div className={navStyles.TitleContainer}>
          <h2 className={navStyles['h1-title']}>Reports List</h2>
        </div>
        {loading ? (
          <p>Loading reports...</p>
        ) : (
          <div className={tableStyles['table-container']}>
            <table className={tableStyles['global-table']}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Complaint</th>
                  <th>Complainant</th>
                  <th>Student</th>
                  <th>Adviser</th>
                  <th>Received</th>
                  {/*<th>Complete</th>*/}
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.reportId} onClick={() => handleRowClick(report)}>
                    <td>{report.date}</td>
                    <td>{report.time}</td>
                    <td>{report.complaint}</td>
                    <td>{report.complainant}</td>
                    <td>{report.student.name}</td>
                    <td>{report.adviser.firstname} {report.adviser.lastname}</td>
                    <td>{report.received ? report.received : 'Pending'}</td>
                    {/* <td>{report.complete ? 'Yes' : 'No'}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className={styles.actionButtons}>
          <button className={styles['report-action-button']} onClick={toggleReportModal}>
            Create Report
          </button>
          {loggedInUser?.userType === 1 && (
            <>
              <button
                className={styles['report-action-button']}
                onClick={() => handleComplete(selectedReportId)}
                disabled={!selectedReportId || selectedReportStatus.completed} // Disable if selected report is completed
              >
                Complete
              </button>
              <button
                className={styles['report-suspension-button']}
                onClick={() => handleAddSuspension(selectedReportId)}
                disabled={!selectedReportId || selectedReportStatus.suspended || selectedReportStatus.completed} // Disable if selected report is already suspended or completed
              >
                {selectedReportStatus.suspended ? 'Suspended' : 'Add Suspension'}
              </button>
            </>
          )}
        </div>

        {showReportModal && (
          <ReportModal
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
            refreshSuspensions={fetchSuspensions} 
          />
        )}
      </div>
    </div>
  );
};

export default Reports;
