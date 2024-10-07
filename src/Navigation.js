import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import NotificationModal from './NotificationModal'; // Import NotificationModal

const Navigation = ({ loggedInUser }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(0); // To store the count of unviewed notifications
  const [allReports, setAllReports] = useState([]); // To store all reports
  const [allSuspensions, setAllSuspensions] = useState([]); // To store all suspensions
  const [showNotificationModal, setShowNotificationModal] = useState(false); // State to control modal visibility

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

  useEffect(() => {
    const fetchNotifications = async () => {
      let unviewedReportsCount = 0;
      let unviewedSuspensionsCount = 0;

      try {
        // Fetch based on userType
        if (loggedInUser?.userType === 1) {
          // SSO: Fetch all reports and suspensions
          const reportsResponse = await axios.get('http://localhost:8080/report/getAllReports');
          const suspensionsResponse = await axios.get('http://localhost:8080/suspension/getAllSuspensions');

          setAllReports(reportsResponse.data);
          setAllSuspensions(suspensionsResponse.data);

          // Filter unviewed reports and suspensions
          const unviewedReports = reportsResponse.data.filter((report) => !report.viewedBySso);
          const unviewedSuspensions = suspensionsResponse.data.filter((suspension) => !suspension.viewedBySso);

          // Count unviewed reports and suspensions
          unviewedReportsCount = unviewedReports.length;
          unviewedSuspensionsCount = unviewedSuspensions.length;

        } else if (loggedInUser?.userType === 2) {
          // Principal: Fetch all suspensions
          const suspensionsResponse = await axios.get('http://localhost:8080/suspension/getAllSuspensions');
          
          setAllSuspensions(suspensionsResponse.data);
          
          // Filter unviewed suspensions
          const unviewedSuspensions = suspensionsResponse.data.filter((suspension) => !suspension.viewedByPrincipal);
          unviewedSuspensionsCount = unviewedSuspensions.length;

        } else if (loggedInUser?.userType === 3) {
          // Adviser: Fetch reports and suspensions by section and school year
          const reportsResponse = await axios.get('http://localhost:8080/report/getAllReportsForAdviser', {
            params: {
              section: loggedInUser.section,
              schoolYear: loggedInUser.schoolYear
            }
          });

          const suspensionsResponse = await axios.get('http://localhost:8080/suspension/getAllSuspensionsBySectionAndSchoolYear', {
            params: {
              section: loggedInUser.section,
              schoolYear: loggedInUser.schoolYear
            }
          });

          setAllReports(reportsResponse.data);
          setAllSuspensions(suspensionsResponse.data);

          // Filter unviewed reports and suspensions
          const unviewedReports = reportsResponse.data.filter((report) => !report.viewedByAdviser);
          const unviewedSuspensions = suspensionsResponse.data.filter((suspension) => !suspension.viewedByAdviser);

          unviewedReportsCount = unviewedReports.length;
          unviewedSuspensionsCount = unviewedSuspensions.length;

        } else if (loggedInUser?.userType === 5 || loggedInUser?.userType === 6) {
          // Complainant (User type 5 or 6): Fetch suspensions by complainant
          const suspensionsResponse = await axios.get('http://localhost:8080/suspension/getAllSuspensionsByComplainant', {
            params: {
              username: loggedInUser.username
            }
          });

          setAllSuspensions(suspensionsResponse.data);
          
          const unviewedSuspensions = suspensionsResponse.data.filter((suspension) => !suspension.viewedByComplainant);

          unviewedSuspensionsCount = unviewedSuspensions.length;
        }

        // Calculate the total unviewed notifications
        setNotifications(unviewedReportsCount + unviewedSuspensionsCount);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [loggedInUser]);

  // Handle opening the notification modal
  const handleNotificationClick = () => {
    setShowNotificationModal(true);
  };

  // Handle closing the notification modal
  const handleModalClose = () => {
    setShowNotificationModal(false);
  };

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

            {/* Notification Icon */}
            <div className={navStyles['notification-icon']} onClick={handleNotificationClick}>
              <NotificationsActiveIcon/>
              {notifications > 0 && <span className={navStyles.badge}>{notifications}</span>} {/* Show badge if there are unviewed notifications */}
            </div>

            {/* Logout Button */}
            <button className={navStyles.logoutbtn} onClick={handleLogout}>
                <Logout />
            </button>
        </header>

        {/* Render Notification Modal */}
        {showNotificationModal && (
          <NotificationModal 
            onClose={handleModalClose} 
            reports={allReports} 
            suspensions={allSuspensions} 
            loggedInUser={loggedInUser}
            refreshNotifications={() => setNotifications(0)} // Refresh notifications count
          />
        )}
    </>
  );
};

export default Navigation;