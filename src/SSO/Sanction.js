import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import '../SSO_Dashboard.css';

const Sanction = () => {
  const [sid, setSid] = useState('');
  const [behaviorDetails, setBehaviorDetails] = useState('');
  const [sanctionRecommendation, setSanctionRecommendation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/sanction/insertSanction', {
        sid,
        behaviorDetails,
        sanctionRecommendation
      });
      console.log(response.data); // log response from the server
      // Clear form fields after successful submission
      setSid('');
      setBehaviorDetails('');
      setSanctionRecommendation('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='wrapper'>
      <div className="sidenav">
        {/* Navigation links */}
        <Link to="/account">Account</Link>
        <Link to="/student">Student</Link>
        <Link to="/notification">Notification</Link>
        <Link to="/feedback">Feedback</Link>
        <Link to="/case">Case</Link>
        <Link to="/pendings">Pendings</Link>
        <Link to="/sanctions">Sanctions</Link>
        <Link to="/report">Report</Link>
        <Link to="/Followup">Followup</Link>
      </div>
      <div className='content'>
        <h1>Sanctions</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="sid">Student ID:</label>
          <input type="text" id="sid" value={sid} onChange={(e) => setSid(e.target.value)} required />
          <label htmlFor="behaviorDetails">Behavior Details:</label>
          <textarea id="behaviorDetails" value={behaviorDetails} onChange={(e) => setBehaviorDetails(e.target.value)} required></textarea>
          <label htmlFor="sanctionRecommendation">Sanction Recommendation:</label>
          <textarea id="sanctionRecommendation" value={sanctionRecommendation} onChange={(e) => setSanctionRecommendation(e.target.value)} required></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Sanction;
