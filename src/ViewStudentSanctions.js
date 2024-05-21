import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewStudentSanctions = () => {
    const { sid } = useParams();
  const [sanctions, setSanctions] = useState([]);

  useEffect(() => {
    document.title = "Student Sanctions";
    const fetchSanctions = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/sanction/getSanctionsBySid/${sid}`);
        setSanctions(response.data);
      } catch (error) {
        console.error('Error fetching sanctions:', error);
      }
    };
    fetchSanctions();
  }, [sid]);

  return (
    <div>
      <h2>Sanctions for Student ID: {sid}</h2>
      <ul>
        {sanctions.map(sanction => (
          <li key={sanction.sanction_id}>
            <div>Behavior Details: {sanction.behaviorDetails}</div>
            <div>Sanction Recommendation: {sanction.sanctionRecommendation}</div>
            <div>Status: {sanction.isApproved === 1 ? 'Approved' : sanction.isApproved === 2 ? 'Declined' : 'Pending'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewStudentSanctions;
