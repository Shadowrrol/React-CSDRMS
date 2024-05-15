import "./Account.css";
import navigationStyles from '../Navigation.module.css';

import { Link, useNavigate } from 'react-router-dom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';

// Function to create sidebar links

const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={navigationStyles['styled-link']}>
        <IconComponent className={navigationStyles.icon} />
        <span className={navigationStyles['link-text']}>{text}</span>
    </Link>
);



const Account = () => {
  const navigate = useNavigate(); 
  const handleLogout = () => {
    // Clear the authentication token from localStorage
    localStorage.removeItem('authToken');
    // Redirect the user to the login page
    navigate('/');
  };
  return (
    <div className={navigationStyles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
      <div className={navigationStyles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="Logo" className={navigationStyles['sidebar-logo']} />
        {createSidebarLink("/report", "Report", AssessmentIcon)}
        {createSidebarLink("/account", "Account", AccountBoxIcon)}
        {createSidebarLink("/student", "Student", SchoolIcon)}
        {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
        {createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
        {createSidebarLink("/case", "Case", PostAddIcon)}
        {createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
        {createSidebarLink("/Followup", "Followups",PendingActionsIcon)}
        <button className={navigationStyles['logoutbtn']} onClick={handleLogout}>Logout</button>
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