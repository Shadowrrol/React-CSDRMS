import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../SSO_Dashboard.css';

const ViewSanctions = () => {
  const [sanctions, setSanctions] = useState([]);

  useEffect(() => {
    const fetchSanctions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/sanction/getAllSanctions');
        setSanctions(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchSanctions();
  }, []);

  const handleApprove = async (sanctionId) => {
    try {
      const response = await axios.post('http://localhost:8080/sanction/approveSanction', null, {
        params: {
          sanctionId: sanctionId
        }
      });
      console.log(response.data); // log response from the server
      // Refresh sanctions after approval
      const updatedSanctions = sanctions.map(sanction => {
        if (sanction.sanction_id === sanctionId) {
          sanction.isApproved = 1;
        }
        return sanction;
      });
      setSanctions(updatedSanctions);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  const handleDecline = async (sanctionId) => {
    try {
        const response = await axios.post('http://localhost:8080/sanction/declineSanction', null, {
          params: {
            sanctionId: sanctionId
          }
        });
        console.log(response.data); // log response from the server
        // Refresh sanctions after approval
        const updatedSanctions = sanctions.map(sanction => {
          if (sanction.sanction_id === sanctionId) {
            sanction.isApproved = 2;
          }
          return sanction;
        });
        setSanctions(updatedSanctions);
      } catch (error) {
        console.error('Error:', error);
      }
  };

  return (
    <div className='wrapper'>
      <div className="sidenav">
        {/* Navigation links */}
        <Link to="/report">Report</Link>
        <Link to="/pendings">Pendings</Link>
        <Link to="/viewSanctions">Sanctions</Link>
      </div>
      <div className='content'>
        <h1>Sanctions</h1>
        <div>
          <h2>All Sanctions</h2>
          <ul>
            {sanctions.map(sanction => (
              <li key={sanction.sanction_id}>
                {/* Display sanction details */}
                <div>Sanction ID: {sanction.sanction_id}</div>
                <div>Student ID: {sanction.sid}</div>
                <div>Behavior Details: {sanction.behaviorDetails}</div>
                <div>Sanction Recommendation: {sanction.sanctionRecommendation}</div>
                <div>Is Approved: {sanction.isApproved}</div>
                {/* Approve and decline buttons */}
                {sanction.isApproved !== 1 && (
                  <div>
                    <button onClick={() => handleApprove(sanction.sanction_id)}>Approve</button>
                    <button onClick={() => handleDecline(sanction.sanction_id)}>Decline</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ViewSanctions;
