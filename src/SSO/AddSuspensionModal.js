import React, { useState } from 'react';
import axios from 'axios';
import styles from './AddSuspensionModal.module.css'; // Style the modal as needed

const AddSuspensionModal = ({ onClose, reportId, refreshReports }) => {
  const [suspensionData, setSuspensionData] = useState({
    days: '',
    startDate: '',
    endDate: '',
    returnDate: ''
  });

  // Handle input changes for the form
  const handleInputChange = (e) => {
    setSuspensionData({ ...suspensionData, [e.target.name]: e.target.value });
  };

  // Handle adding suspension
  const handleCreateSuspension = async () => {
    try {
      const suspensionPayload = {
        ...suspensionData,
        reportId, // Use the reportId passed as a prop
        dateSubmitted: new Date().toISOString().split('T')[0], // Set the current date
      };

      await axios.post('http://localhost:8080/suspension/insertSuspension', suspensionPayload);
      refreshReports(); // Refresh the reports list after submission
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error creating suspension:', error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Add Suspension</h2>

        {/* Suspension form fields */}
        <div>
          <input
            type="number"
            name="days"
            placeholder="Number of Suspension Days"
            value={suspensionData.days}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={suspensionData.startDate}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="endDate"
            placeholder="End Date"
            value={suspensionData.endDate}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="returnDate"
            placeholder="Return Date"
            value={suspensionData.returnDate}
            onChange={handleInputChange}
          />
        </div>

        {/* Modal Actions */}
        <div className={styles.modalActions}>
          <button onClick={handleCreateSuspension}>Add Suspension</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddSuspensionModal;
