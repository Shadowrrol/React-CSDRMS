import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './ViewReport.module.css';
import Navigation from './Navigation';
import navStyles from "./Navigation.module.css";

const ViewReport = () => {
  const authToken = localStorage.getItem("authToken");
  const loggedInUser = authToken ? JSON.parse(authToken) : null;
  const { reportId } = useParams(); // Get the reportId from the URL
  const [report, setReport] = useState(null);
  const [suspension, setSuspension] = useState(null); // State for suspension
  const [loading, setLoading] = useState(true);
  const [suspensionLoading, setSuspensionLoading] = useState(true); // Loading state for suspension

  // Fetch the report data when the component mounts
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/report/getReport/${reportId}`);
        setReport(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching report:', error);
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  // Fetch the suspension data associated with the report
  useEffect(() => {
    const fetchSuspension = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/suspension/getSuspensionByReport/${reportId}`);
        setSuspension(response.data);
        setSuspensionLoading(false);
      } catch (error) {
        console.error('Error fetching suspension:', error);
        setSuspensionLoading(false);
      }
    };

    fetchSuspension();
  }, [reportId]);

  if (loading) {
    return <p>Loading report...</p>;
  }

  if (!report) {
    return <p>Report not found.</p>;
  }

  return (
    <div className={navStyles.wrapper}>
      <Navigation loggedInUser={loggedInUser} />
      <div className={navStyles.content}>
        <h2>Report Details</h2>
        <div className={styles['report-details']}>
          <p><strong>Date:</strong> {report.date}</p>
          <p><strong>Time:</strong> {report.time}</p>
          <p><strong>Complaint:</strong> {report.complaint}</p>
          <p><strong>Complainant:</strong> {report.complainant}</p>
          <p><strong>Student:</strong> {report.student.name}</p>
          <p><strong>Adviser:</strong> {report.adviser.firstname} {report.adviser.lastname}</p>
          <p><strong>Received:</strong> {report.received ? report.received : 'Pending'}</p>
          <p><strong>Complete:</strong> {report.complete ? 'Yes' : 'No'}</p>
          <p><strong>Viewed by Adviser:</strong> {report.viewedByAdviser ? 'Yes' : 'No'}</p>
          <p><strong>Viewed by SSO:</strong> {report.viewedBySso ? 'Yes' : 'No'}</p>
        </div>

        {/* Display Suspension details */}
        
        {suspensionLoading ? (
          <p>Loading suspension details...</p>
        ) : suspension ? (
          <div className={styles['suspension-details']}>
            <h2>Suspension details for the given Report</h2>
            <p><strong>Date Submitted:</strong> {suspension.dateSubmitted}</p>
            <p><strong>Days Suspended:</strong> {suspension.days}</p>
            <p><strong>Start Date:</strong> {suspension.startDate}</p>
            <p><strong>End Date:</strong> {suspension.endDate}</p>
            <p><strong>Return Date:</strong> {suspension.returnDate}</p>
            <p><strong>Viewed by Principal:</strong> {suspension.viewedByPrincipal ? 'Yes' : 'No'}</p>
            <p><strong>Viewed by Adviser:</strong> {suspension.viewedByAdviser ? 'Yes' : 'No'}</p>
            <p><strong>Viewed by SSO:</strong> {suspension.viewedBySso ? 'Yes' : 'No'}</p>
          </div>
        ) : (
          <p>No suspension details found for this report.</p>
        )}
      </div>
    </div>
  );
};

export default ViewReport;
