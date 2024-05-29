import "./Account.css";
import navigationStyles from '../Navigation.module.css';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';


import MenuPopupState from '../components/MenuPopupState';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

// Function to create sidebar links

const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={navigationStyles['styled-link']}>
        <IconComponent className={navigationStyles.icon} />
        <span className={navigationStyles['link-text']}>{text}</span>
    </Link>
);



const Account = () => {
  useEffect(() => {
    document.title = "SSO | Accounts";
  }, []); 
  const navigate = useNavigate(); 
  
  return (
    <div className={navigationStyles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
      <div className={navigationStyles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="Logo" className={navigationStyles['sidebar-logo']} />
        {createSidebarLink("/AdminDashboard", "Dashboard", AssessmentIcon)}
        {createSidebarLink("/account", "Account", AccountBoxIcon)}
        {createSidebarLink("/class", "Class", MeetingRoomIcon)}
        <MenuPopupState />
      </div>  
      
      
      <div className="Frame">
        <h2 className={navigationStyles.h2}>Register Account</h2>
        <Link to="/register/principal">
          <button type="submit" className="But">Principal</button>
          </Link>
          <Link to="/register/sso">
          <button type="submit" className="But">SSO Officer</button>
        </Link>
        <Link to="/register/adviser">
          <button type="submit"className="But">Adviser</button>
        </Link>
      </div>
    </div>
  );
}

export default Account;