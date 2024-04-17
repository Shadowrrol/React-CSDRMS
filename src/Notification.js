import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Notification.css';

const Notification = () => {
  // Access location state to get userInfo
  const location = useLocation();
  const userInfo = location.state ? location.state.userInfo : null;

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
        </div>
        <div className='content'>
            <h1>Notif</h1>
        </div>
    </div>
  );
}

export default Notification;
