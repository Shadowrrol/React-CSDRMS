import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigate hook for navigation
import axios from 'axios';
import styles from './NotificationModal.module.css';

const NotificationModal = ({ onClose, loggedInUser, reports, suspensions, refreshNotifications }) => {
  const navigate = useNavigate(); // Initialize navigate

  // Automatically mark notifications as viewed when modal opens
  useEffect(() => {
    const markNotificationsAsViewed = async () => {
      try {
        if (loggedInUser?.userType === 1) {
          await axios.post('http://localhost:8080/report/markAsViewedForSso');
          await axios.post('http://localhost:8080/suspension/markAsViewedForSso');
        } else if (loggedInUser?.userType === 2) {
          await axios.post('http://localhost:8080/suspension/markAsViewedForPrincipal');
        } else if (loggedInUser?.userType === 3) {
          await axios.post('http://localhost:8080/report/markAsViewedForAdviser', null, {
            params: {
              grade: loggedInUser.grade,
              section: loggedInUser.section,
              schoolYear: loggedInUser.schoolYear,
            },
          });
          await axios.post('http://localhost:8080/suspension/markAsViewedForAdviser', null, {
            params: {
              grade: loggedInUser.grade,
              section: loggedInUser.section,
              schoolYear: loggedInUser.schoolYear,
            },
          });
        } else if (loggedInUser?.userType === 5 || loggedInUser?.userType === 6) {
          await axios.post('http://localhost:8080/suspension/markAsViewedForComplainant', null, {
            params: {
              username: loggedInUser.username,
            },
          });
        }
        refreshNotifications();
      } catch (error) {
        console.error('Error marking notifications as viewed:', error);
      }
    };

    markNotificationsAsViewed();
  }, [loggedInUser, refreshNotifications]);

  // Handle viewing a report
  const handleViewReport = (reportId) => {
    navigate(`/view-report/${reportId}`);
  };

  return (
    <div className={styles['notification-modal-overlay']}>
        <div className={styles['notification-modal-content']}>
            <button className={styles['notification-close-button']} onClick={onClose}>
                ✕
            </button>
            <h2 className={styles['notification-modal-title']}>Your Notifications</h2>

            <h3 className={styles['notification-modal-section-title']}>New Reports</h3>
            {reports.length > 0 ? (
                <ul className={styles['notification-modal-list']}>
                    {reports
                        .filter(report => report.complainant !== loggedInUser?.username)
                        .map((report) => (
                            <li
                                key={report.reportId}
                                className={`${styles['notification-modal-list-item']} ${styles['clickable']}`}
                                onClick={() => handleViewReport(report.reportId)}
                            >
                                <strong>{report.student.name}</strong> from <strong>{report.student.grade} - {report.student.section}</strong> has a report concerning a recent incident. <br />
                                <small>Click to view details.</small>
                            </li>
                        ))}
                </ul>
            ) : (
                <p className={styles['notification-modal-empty-message']}>You have no new reports at the moment.</p>
            )}

            {loggedInUser?.userType !== 1 && (
                <>
                    <h3 className={styles['notification-modal-section-title']}>Recent Suspensions</h3>
                    {suspensions.length > 0 ? (
                        <ul className={styles['notification-modal-list']}>
                            {suspensions.map((suspension) => (
                                <li
                                    key={suspension.suspensionId}
                                    className={`${styles['notification-modal-list-item']} ${styles['clickable']}`}
                                    onClick={() => handleViewReport(suspension.reportEntity.reportId)}
                                >
                                    <strong>{suspension.reportEntity.student.name}</strong> has been suspended. 
                                    <br />
                                    <small>Click to view report details.</small>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles['notification-modal-empty-message']}>No suspensions recorded at this time.</p>
                    )}
                </>
            )}
        </div>
    </div>
  );
};

export default NotificationModal;
