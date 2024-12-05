import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './NotificationModal.module.css';
import ViewRecord from './Record/ViewRecordModal'; // Import ViewRecord component

const NotificationModal = ({ onClose, loggedInUser, notifications, refreshNotifications }) => {
  const navigate = useNavigate();
  const [showViewRecordModal, setShowViewRecordModal] = useState(false); // State to control the ViewRecord modal
  const [selectedNotificationId, setSelectedNotificationId] = useState(null); // Selected notification ID
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  // Automatically mark notifications as viewed when modal opens
  useEffect(() => {
    const markNotificationsAsViewed = async () => {
      try {
        await axios.post(`https://spring-csdrms.onrender.com/notifications/user/${loggedInUser.userId}/mark-all-as-viewed`);
        refreshNotifications(); // Refresh notification count
      } catch (error) {
        console.error('Error marking notifications as viewed:', error);
      }
    };
  
    markNotificationsAsViewed();
  }, [loggedInUser, refreshNotifications]);
  

  // Handle viewing a record in modal
  const handleViewRecord = (recordId) => {
    setSelectedRecordId(recordId);
    setShowViewRecordModal(true); // Show the ViewRecord modal
  };

  const closeViewRecordModal = () => {
    setShowViewRecordModal(false);
    setSelectedRecordId(null); // Clear the selected record ID
  };

  return (
    <div className={styles['notification-modal-overlay']}>
      <div className={styles['notification-modal-content']}>
        <button className={styles['notification-close-button']} onClick={onClose}>
          ✕
        </button>
        <h2 className={styles['notification-modal-title']}>Your Notifications</h2>

        {notifications.length > 0 ? (
          <ul className={styles['notification-modal-list']}>
            {notifications
              .sort((a, b) => b.notificationId - a.notificationId) // Sort by newest first
              .map(notification => (
                <li
                  key={notification.notificationId}
                  className={`${styles['notification-modal-list-item']} ${styles['clickable']}`}
                  onClick={() => handleViewRecord(notification.notification.record.recordId)}
                >
                  <strong>{notification.notification.message}</strong>
                  <br />
                  <small>Click to view details.</small>
                </li>
              ))}
          </ul>
        ) : (
          <p className={styles['notification-modal-empty-message']}>You have no new notifications.</p>
        )}
                
      </div>

      {/* View Record Modal */}
      {showViewRecordModal && selectedRecordId && (
        <ViewRecord
          recordId={selectedRecordId}
          onClose={closeViewRecordModal}
        />
      )}
    </div>
  );
};

export default NotificationModal;
