import React, { useState } from 'react';
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
/*import TableViewIcon from '@mui/icons-material/TableView';*/

/*import MenuPopupState from '../components/MenuPopupState';*/

const Navigation = ({ loggedInUser }) => {
  const navigate = useNavigate();
  const [notifications] = useState(9);

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

            {/* SSO - usertype 1 */}
            {loggedInUser.userType === 1 && createSidebarLink("/record", "Dashboard", AssessmentIcon)}
            {loggedInUser.userType === 1 && createSidebarLink("/student", "Student", SchoolIcon)}
            {loggedInUser.userType === 1 && createSidebarLink("/timeLog", "Time Log", AccessTimeFilledIcon)}
            {loggedInUser.userType === 1 && createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
            {loggedInUser.userType === 1 && createSidebarLink("/report", "Report", PostAddIcon)}
            {/* {loggedInUser.userType === 1 && loggedInUser.userType === 6 && createSidebarLink("/student", "Student", SchoolIcon)} 
                {loggedInUser.userType === 2 && loggedInUser.userType === 6 && createSidebarLink("/notification", "Notification", NotificationsActiveIcon)} */}

            {/* Principal - usertype 2 */}
            {loggedInUser.userType === 2 && createSidebarLink("/record", "Dashboard", AssessmentIcon)}
            {loggedInUser.userType === 2 && createSidebarLink("/viewSuspensions", "Suspension", LocalPoliceIcon)}
            {loggedInUser.userType === 2 && createSidebarLink("/report", "Report", PostAddIcon)}

            {/* Adviser - usertype 3 */}
            {loggedInUser.userType === 3 && createSidebarLink("/record", "Dashboard", AssessmentIcon)}
            {loggedInUser.userType === 3 && createSidebarLink("/student", "Student", SchoolIcon)}
            {loggedInUser.userType === 3 && createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
            {loggedInUser.userType === 3 && createSidebarLink("/report", "Report", PostAddIcon)}            

            {/* Admin - usertype 4 */}
            {loggedInUser.userType === 4 && createSidebarLink("/AdminDashboard", "Dashboard", AccountBoxIcon)}
            {loggedInUser.userType === 4 && createSidebarLink("/Class", "Class", SchoolIcon)}

            {/* Guidance - usertype 6 */}
            {loggedInUser.userType === 6 && createSidebarLink("/record", "Dashboard", AssessmentIcon)}
            {loggedInUser.userType === 6 && createSidebarLink("/report", "Report", PostAddIcon)}             

        </div>

        {/* Header */}
        <header className={navStyles.header}>
            <div className={navStyles.JHSheaderContainer}>
                <img src={JHSLogo} alt="JHS Logo" className={navStyles.JHSLogo} />
                <span className={navStyles.JHSTitle}>JHS Success Hub</span>
            </div>
            {/* Logout Button */}
            <div className={navStyles['notification-icon']}>
            <NotificationsActiveIcon/>
            {notifications > 0 && <span  className={navStyles.badge}>{notifications}</span>}
            </div>
            <button className={navStyles.logoutbtn} onClick={handleLogout}>
                <Logout />
            </button>
        </header>
    </>
  );
};

export default Navigation;
