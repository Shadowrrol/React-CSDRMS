// ViewReport.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ViewReport.module.css';

const ViewReport = ({ reportId, onClose }) => {
  const authToken = localStorage.getItem("authToken");
  const loggedInUser = authToken ? JSON.parse(authToken) : null;
  const [report, setReport] = useState(null);
  const [suspension, setSuspension] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suspensionLoading, setSuspensionLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/report/getReport/${reportId}`);
        if (response.status === 200) {
          setReport(response.data);
        } else {
          setError('Report not found.');
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        setError('Error fetching report.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  useEffect(() => {
    const fetchSuspension = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/suspension/getSuspensionByReport/${reportId}`);
        if (response.status === 200) {
          setSuspension(response.data);
        } else {
          setSuspension(null);
        }
      } catch (error) {
        console.error('Error fetching suspension:', error);
        setSuspension(null);
      } finally {
        setSuspensionLoading(false);
      }
    };

    fetchSuspension();
  }, [reportId]);

  if (loading) {
    return <p>Loading report...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles['viewreport-modal-overlay']}>
      <div className={styles['viewreport-modal-content']}>
        <button className={styles['close-button']} onClick={onClose}>
          &times; {/* Close button */}
        </button>
        <div className={styles.tablesContainer}>
          <h2>Report Details</h2>
          <table className={styles['report-details']}>
            <thead>
              <tr>
                <th>Field</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Student:</td>
                <td>{report.student.name}</td>
              </tr>
              <tr>
                <td>Adviser:</td>
                <td>{report.adviser.firstname} {report.adviser.lastname}</td>
              </tr>
              <tr>
                <td>Date:</td>
                <td>{report.date}</td>
              </tr>
              <tr>
                <td>Time:</td>
                <td>{report.time}</td>
              </tr>
              <tr>
                <td>Received:</td>
                <td>{report.received ? report.received : 'Pending'}</td>
              </tr>
              <tr>
                <td>Complaint:</td>
                <td>{report.complaint}</td>
              </tr>
              <tr>
                <td>Complainant:</td>
                <td>{report.complainant}</td>
              </tr>
              <tr>
                <td>Complete:</td>
                <td>{report.complete ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <td>Viewed by Adviser:</td>
                <td>{report.viewedByAdviser ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <td>Viewed by SSO:</td>
                <td>{report.viewedBySso ? 'Yes' : 'No'}</td>
              </tr>
            </tbody>
          </table>

          <h2>Suspension Details</h2>
          {suspensionLoading ? (
            <p>Loading suspension details...</p>
          ) : suspension ? (
            <table className={styles['suspension-details-table']}>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Date Submitted:</td>
                  <td>{suspension.dateSubmitted}</td>
                </tr>
                <tr>
                  <td>Days Suspended:</td>
                  <td>{suspension.days}</td>
                </tr>
                <tr>
                  <td>Start Date:</td>
                  <td>{suspension.startDate}</td>
                </tr>
                <tr>
                  <td>End Date:</td>
                  <td>{suspension.endDate}</td>
                </tr>
                <tr>
                  <td>Return Date:</td>
                  <td>{suspension.returnDate}</td>
                </tr>
                <tr>
                  <td>Viewed by Principal:</td>
                  <td>{suspension.viewedByPrincipal ? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                  <td>Viewed by Adviser:</td>
                  <td>{suspension.viewedByAdviser ? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                  <td>Viewed by SSO:</td>
                  <td>{suspension.viewedBySso ? 'Yes' : 'No'}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>No suspension details found for this report.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
