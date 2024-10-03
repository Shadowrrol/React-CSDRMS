import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logout from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import navStyles from './Navigation.module.css'; // CSS for Navigation
import JHSLogo from './image-sso-yellow.png';
/*import MenuPopupState from '../components/MenuPopupState';*/

const Navigation = ({ loggedInUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={navStyles['styled-link']}>
      <IconComponent className={navStyles.icon} />
      <span>{text}</span>
    </Link>
  );

  return (
    <>
        {/* Sidebar */}
        <div className={navStyles.sidenav}>
            <div className={navStyles['sidenav-title']}>MENU</div>
            {/* Admin */}
            {loggedInUser.userType === 4 && createSidebarLink("/AdminDashboard", "Dashboard", AccountBoxIcon)}
            {loggedInUser.userType === 4 && createSidebarLink("/Class", "Class", SchoolIcon)}

            {loggedInUser.userType === 2 && createSidebarLink("/record", "Dashboard", AssessmentIcon)}
            {loggedInUser.userType === 1 && loggedInUser.userType === 6 && createSidebarLink("/student", "Student", SchoolIcon)}
            {loggedInUser.userType === 2 && loggedInUser.userType === 6 && createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
            {loggedInUser.userType === 2 && createSidebarLink("/report", "Report", PostAddIcon)}
            {loggedInUser.userType === 2 && createSidebarLink("/viewSuspensions", "Suspensions", LocalPoliceIcon)}
            {loggedInUser.userType === 1 && createSidebarLink("/timeLog", "Time Log", AccessTimeFilledIcon)}
        </div>

        {/* Header */}
        <header className={navStyles.header}>
            <div className={navStyles.JHSheaderContainer}>
                <img src={JHSLogo} alt="JHS Logo" className={navStyles.JHSLogo} />
                <span className={navStyles.JHSTitle}>JHS Success Hub</span>
            </div>
            {/* Logout Button */}
            <button className={navStyles.logoutbtn} onClick={handleLogout}>
                <Logout />
            </button>
        </header>
    </>
  );
};

export default Navigation;
