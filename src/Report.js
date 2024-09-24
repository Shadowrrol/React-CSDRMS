import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navigation.module.css";

import AssessmentIcon from "@mui/icons-material/Assessment";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PostAddIcon from "@mui/icons-material/PostAdd";
import RateReviewIcon from "@mui/icons-material/RateReview";
import SchoolIcon from "@mui/icons-material/School";

const Report = () => {
  const authToken = localStorage.getItem("authToken");
  const loggedInUser = JSON.parse(authToken);
  const navigate = useNavigate();
 



  const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={styles["styled-link"]}>
      <IconComponent className={styles.icon} />
      <span className={styles["link-text"]}>{text}</span>
    </Link>
  );

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };


  return (
    <div className={styles.wrapper} style={{ backgroundImage: "url(/public/image-2-3@2x.png)" }}>
      <div className={styles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="" className={styles["sidebar-logo"]} />
        {loggedInUser.userType !== 5 && createSidebarLink("/record", "Record", AssessmentIcon)}
        {loggedInUser.userType !== 5 && loggedInUser.userType !== 6 && createSidebarLink("/student", "Student", SchoolIcon)}
        {loggedInUser.userType !== 5 && loggedInUser.userType !== 6 &&createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
        {loggedInUser.userType !== 1 && loggedInUser.userType !== 5 && loggedInUser.userType !== 6 && createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
        {createSidebarLink("/report", "Report", PostAddIcon)}
        {loggedInUser.userType !== 3 && loggedInUser.userType !== 5 && loggedInUser.userType !== 6 &&
          createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
        {loggedInUser.userType !== 5 && loggedInUser.userType !== 6 &&  createSidebarLink("/Followup", "Followups", PendingActionsIcon)}
        <button className={styles["logoutbtn"]} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Report;
