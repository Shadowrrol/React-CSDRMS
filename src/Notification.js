import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navigation.module.css";

import AssessmentIcon from "@mui/icons-material/Assessment";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PostAddIcon from "@mui/icons-material/PostAdd";
import RateReviewIcon from "@mui/icons-material/RateReview";
import SchoolIcon from "@mui/icons-material/School";

const createSidebarLink = (to, text, IconComponent) => (
  <Link to={to} className={styles["styled-link"]}>
    <IconComponent className={styles.icon} /> {/* Icon */}
    <span className={styles["link-text"]}>{text}</span> {/* Text */}
  </Link>
);

const Notification = () => {
  const navigate = useNavigate();
  const [sanctions, setSanctions] = useState([]);
  const authToken = localStorage.getItem("authToken");
  const loggedInUser = JSON.parse(authToken);

  const fetchSanctions = useCallback(async () => {
    try {
      let response;
      if (loggedInUser.userType === 3) {
        response = await fetch(
          `http://localhost:8080/sanction/getSanctionsBySectionAndSchoolYear?section=${loggedInUser.section}&schoolYear=${loggedInUser.schoolYear}`
        );
      } else {
        response = await fetch("http://localhost:8080/sanction/getApprovedAndDeclinedSanctions");
      }
      const data = await response.json();
      setSanctions(data);
    } catch (error) {
      console.error("Error fetching sanctions:", error);
    }
  }, [loggedInUser]);

  useEffect(() => {
    // Fetch sanctions data when component mounts
    document.title = "Notification";
    fetchSanctions();
  }, [fetchSanctions]);

  const handleLogout = () => {
    // Clear the authentication token from localStorage
    localStorage.removeItem("authToken");
    // Redirect the user to the login page
    navigate("/");
  };

  const handleAcknowledge = async (sanctionId) => {
    try {
      const response = await fetch("http://localhost:8080/feedback/insertFeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: loggedInUser.uid, // Assuming uid is the current user's ID
          sanction_id: sanctionId,
          isAcknowledged: 1, // Set to 1 for acknowledged
        }),
      });
      if (response.ok) {
        // If feedback insertion is successful, fetch sanctions again to update the UI
        fetchSanctions();
      } else {
        console.error("Failed to insert feedback");
      }
    } catch (error) {
      console.error("Error inserting feedback:", error);
    }
  };

  const getSanctionStatus = (isApproved) => {
    return isApproved === 1 ? "Accepted" : isApproved === 2 ? "Declined" : "Pending";
  };

  const renderSanctions = () => {
    return (
      <div>
        <div
          style={{
            width: "160vh",
            border: "2px solid black",
            borderRadius: "12px",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#a02727",
          }}
        >
          <h2 style={{ color: "white" }}>Approved and Declined Sanctions</h2>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            padding: "32px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {sanctions.map((sanction) => (
            <div
              key={sanction.sanction_id} // Move key to the container div
              style={{
                border: "1px black solid",
                width: "80vh",
                borderRadius: "15px",
                backgroundColor: "#a43737",
              }}
            >
              <li style={{ listStyle: "none" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "white",
                    padding: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "50%",
                      gap: "8px",
                      fontSize: "18px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        padding: "8px",
                      }}
                    >
                      <div>
                        <b>
                          Student Name:
                          {sanction.student.firstname} {sanction.student.lastname}
                        </b>
                      </div>
                      <div>
                        <b>Behavior Details: {sanction.behaviorDetails}</b>
                      </div>
                      <div>
                        <b>Sanction Recommendation: {sanction.sanctionRecommendation}</b>
                      </div>
                      <div>
                        <b>Status: {getSanctionStatus(sanction.isApproved)}</b>
                      </div>
                    </div>
                  </div>

                  {/* Add acknowledge button */}
                  <button
                    onClick={() => handleAcknowledge(sanction.sanction_id)}
                    style={{
                      height: "64px",
                      alignSelf: "center",
                      backgroundColor: "#e8bd26",
                      color: "black",
                      transition: "background-color 0.5s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "black";
                    }}
                  >
                    Acknowledge
                  </button>
                </div>
              </li>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wrapper} style={{ backgroundImage: "url(/public/image-2-3@2x.png)" }}>
      <div className={styles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="" className={styles["sidebar-logo"]} />
        {createSidebarLink("/report", "Report", AssessmentIcon)}
        {createSidebarLink("/student", "Student", SchoolIcon)}
        {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
        {loggedInUser.userType !== 1 && createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
        {loggedInUser.userType !== 2 && (
          <>
            {loggedInUser.userType === 3
              ? createSidebarLink("/adviserCase", "Case", PostAddIcon)
              : createSidebarLink("/case", "Case", PostAddIcon)}
          </>
        )}
        {loggedInUser.userType !== 1 && loggedInUser.userType !== 2 && createSidebarLink("/Followup", "Followups", PendingActionsIcon)}
        <button className={styles["logoutbtn"]} onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className={styles.content}>
        <h1>Notifications</h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to top, rgba(100,0,0,.9), rgba(100,0,0,0.3))",
            borderRadius: "12px",
          }}
        >
          {renderSanctions()}
        </div>
      </div>
    </div>
  );
};

export default Notification;
