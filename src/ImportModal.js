import React, { useState } from 'react';
import axios from 'axios';
import styles from './ImportModal.module.css'; // Import the updated CSS

const ImportModal = ({ onClose, schoolYears }) => {
  const [file, setFile] = useState(null);
  const [importSchoolYear, setImportSchoolYear] = useState('');

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file || !importSchoolYear) {
      alert('Please select a file and school year.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('schoolYear', importSchoolYear);

    try {
      await axios.post('http://localhost:8080/student/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully');
      onClose(); // Close the modal after upload
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  return (
    <div className={styles['import-modal-overlay']}>
      <div className={styles['import-modal-content']}>
        <h2 className={styles['import-modal-header']}>Import Student Data</h2>

        <label htmlFor="importSchoolYear">Select School Year for Import:</label>
        <select
          id="importSchoolYear"
          className={styles['import-modal-select']}
          value={importSchoolYear}
          onChange={(e) => setImportSchoolYear(e.target.value)}
        >
          <option value="">Select School Year</option>
          {schoolYears.map((year) => (
            <option key={year.schoolYear_ID} value={year.schoolYear}>
              {year.schoolYear}
            </option>
          ))}
        </select>

        <input
          type="file"
          className={styles['import-modal-file-input']}
          onChange={handleFileChange}
        />

        <div>
          <button
            className={`${styles['import-modal-button']} ${styles['import-modal-button-primary']}`}
            onClick={handleFileUpload}
          >
            Import
          </button>
          <button
            className={`${styles['import-modal-button']} ${styles['import-modal-button-secondary']}`}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
