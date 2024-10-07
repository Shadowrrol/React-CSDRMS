import React, { useEffect } from 'react';
import axios from 'axios';
import styles from './NotificationModal.module.css';

const NotificationModal = ({ onClose, loggedInUser, reports, suspensions, refreshNotifications }) => {

  // Automatically mark notifications as viewed when modal opens
  useEffect(() => {
    const markNotificationsAsViewed = async () => {
      try {
        if (loggedInUser?.userType === 1) {
          // Mark as viewed for SSO
          await axios.post('http://localhost:8080/report/markAsViewedForSso');
          await axios.post('http://localhost:8080/suspension/markAsViewedForSso');
        } else if (loggedInUser?.userType === 2) {
          // Mark as viewed for Principal
          await axios.post('http://localhost:8080/suspension/markAsViewedForPrincipal');
        } else if (loggedInUser?.userType === 3) {
          // Mark as viewed for Adviser, pass section and schoolYear
          await axios.post('http://localhost:8080/report/markAsViewedForAdviser', null, {
            params: {
              section: loggedInUser.section,
              schoolYear: loggedInUser.schoolYear,  // Ensure these are correctly set
            },
          });
          await axios.post('http://localhost:8080/suspension/markAsViewedForAdviser', null, {
            params: {
              section: loggedInUser.section,
              schoolYear: loggedInUser.schoolYear,  // Ensure these are correctly set
            },
          });
        } else if (loggedInUser?.userType === 5 || loggedInUser?.userType === 6) {
          // Mark as viewed for Complainant, pass username
          await axios.post('http://localhost:8080/suspension/markAsViewedForComplainant', null, {
            params: {
              username: loggedInUser.username,
            },
          });
        }

        // Refresh notifications after marking them as viewed
        refreshNotifications();

      } catch (error) {
        console.error('Error marking notifications as viewed:', error);
      }
    };

    markNotificationsAsViewed();
  }, [loggedInUser, refreshNotifications]);

  return (
    <div className={styles['notification-modal-overlay']}>
      <div className={styles['notification-modal-content']}>
        <button className={styles['notification-close-button']} onClick={onClose}>
          ✕
        </button>
        <h2 className={styles['notification-modal-title']}>Notifications</h2>

        <h3 className={styles['notification-modal-section-title']}>Reports</h3>
        {reports.length > 0 ? (
          <ul className={styles['notification-modal-list']}>
            {reports.map((report) => (
              <li key={report.reportId} className={styles['notification-modal-list-item']}>
                <strong>Complaint:</strong> {report.complaint}<br />
                <strong>Complainant:</strong> {report.complainant}<br />
                <strong>Student:</strong> {report.student.name}<br />
                
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles['notification-modal-empty-message']}>No reports available.</p>
        )}

        <h3 className={styles['notification-modal-section-title']}>Suspensions</h3>
        {suspensions.length > 0 ? (
          <ul className={styles['notification-modal-list']}>
            {suspensions.map((suspension) => (
              <li key={suspension.suspensionId} className={styles['notification-modal-list-item']}>
                <strong>Start Date:</strong> {suspension.startDate}<br />
                <strong>End Date:</strong> {suspension.endDate}<br />
                <strong>Viewed:</strong> {suspension.viewedByAdviser || suspension.viewedBySso || suspension.viewedByPrincipal ? 'Yes' : 'No'}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles['notification-modal-empty-message']}>No suspensions available.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
