import React, { useState } from 'react';
import axios from 'axios';
import styles from './AddSuspensionModal.module.css'; // Style the modal as needed

const AddSuspensionModal = ({ onClose, reportId, refreshReports, refreshSuspensions }) => {
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
      
      refreshSuspensions(); // Call the suspension refresh function passed from parent
      refreshReports(); // Optionally refresh reports to reflect any report changes
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
        <div className={styles.formGroup}>
          <label htmlFor="days">Number of Suspension Days</label>
          <input
            type="number"
            id="days"
            name="days"
            placeholder="Number of Suspension Days"
            value={suspensionData.days}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={suspensionData.startDate}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={suspensionData.endDate}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="returnDate">Return Date</label>
          <input
            type="date"
            id="returnDate"
            name="returnDate"
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
