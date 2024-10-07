import React, { useState } from 'react';
import axios from 'axios';
import styles from './AddRecordModal.module.css'; // Importing CSS module for the modal

const AddRecordModal = ({ student, onClose }) => {
  const [recordDate, setRecordDate] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [time, setTime] = useState('');
  const [monitoredRecord, setMonitoredRecord] = useState('');
  const [remarks, setRemarks] = useState('');

  const monitoredRecordsList = [
    'Absent',
    'Tardy',
    'Cutting Classes',
    'Improper Uniform',
    'Offense',
    'Misbehavior',
    'Clinic',
    'Sanction',
  ];

  const handleSubmit = async () => {
    const newRecord = {
      sid: student.sid,
      id: student.id, // Assuming `id` is available in the student object
      record_date: recordDate,
      incident_date: incidentDate,
      time: time,
      monitored_record: monitoredRecord,
      remarks: remarks,
    };

    try {
      await axios.post('http://localhost:8080/student-record/insertRecord', newRecord);
      alert('Record added successfully');
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error adding record:', error);
      alert('Error adding record');
    }
  };

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <h3>Add New Record for {student.name}</h3>
        <label>Record Date:</label>
        <input
          type="date"
          value={recordDate}
          onChange={(e) => setRecordDate(e.target.value)}
        />

        <label>Incident Date:</label>
        <input
          type="date"
          value={incidentDate}
          onChange={(e) => setIncidentDate(e.target.value)}
        />

        <label>Time:</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <label>Monitored Record:</label>
        <select
          value={monitoredRecord}
          onChange={(e) => setMonitoredRecord(e.target.value)}
        >
          <option value="">Select Record Type</option>
          {monitoredRecordsList.map((record) => (
            <option key={record} value={record}>
              {record}
            </option>
          ))}
        </select>

        <label>Remarks:</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddRecordModal;
