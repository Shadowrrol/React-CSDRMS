import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navigation.module.css";

import AssessmentIcon from "@mui/icons-material/Assessment";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PostAddIcon from "@mui/icons-material/PostAdd";
import RateReviewIcon from "@mui/icons-material/RateReview";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

const createSidebarLink = (to, text, IconComponent) => (
  <Link to={to} className={styles["styled-link"]}>
    <IconComponent className={styles.icon} />
    <span className={styles["link-text"]}>{text}</span>
  </Link>
);

const Notification = () => {
  const navigate = useNavigate();
  const [sanctions, setSanctions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]); // New state for feedbacks
  const [followups, setFollowups] = useState([]); // New state for follow-ups
  const [sanctionError, setSanctionError] = useState(null); // Separate sanction error
  const [feedbackError, setFeedbackError] = useState(null); // Separate feedback error
  const [followupError, setFollowupError] = useState(null); // Separate follow-up error
  const authToken = localStorage.getItem("authToken");
  const loggedInUser = JSON.parse(authToken);
  const [page, setPage] = useState(1);
  const limit = 4;

  const nextPage = () => setPage(page + 1);
  const prevPage = () => setPage(page > 1 ? page - 1 : page);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const fetchData = useCallback(async () => {
    try {
      const fetchSanctions = async () => {
        let response;
        if (loggedInUser.userType === 3) {
          response = await fetch(
            `http://localhost:8080/sanction/getSanctionsBySectionAndSchoolYear?section=${loggedInUser.section}&schoolYear=${loggedInUser.schoolYear}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
        } else {
          response = await fetch(
            "http://localhost:8080/sanction/getApprovedAndDeclinedSanctions",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
        }

        if (!response.ok) {
          throw new Error(`Sanction fetch failed with status ${response.status}`);
        }

        return response.json();
      };

      const fetchFeedbacks = async () => {
        if (loggedInUser.userType === 3) {
          const response = await fetch(
            `http://localhost:8080/feedback/getFeedbacksForAdviser/${loggedInUser.section}/${loggedInUser.schoolYear}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error(`Feedback fetch failed with status ${response.status}`);
          }

          return response.json();
        }
        return []; // If not userType 3, return empty feedbacks array
      };

      const fetchFollowups = async () => {
        if (loggedInUser.userType === 3) {
          const response = await fetch(
            `http://localhost:8080/followup/getAllFollowUpsByAdviser/${loggedInUser.section}/${loggedInUser.schoolYear}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error(`Follow-up fetch failed with status ${response.status}`);
          }

          return response.json();
        }
        return []; // If not userType 3, return empty follow-ups array
      };

      const [sanctionsData, feedbacksData, followupsData] = await Promise.all([
        fetchSanctions(),
        fetchFeedbacks(),
        fetchFollowups(),
      ]);

      console.log("Sanctions Data:", sanctionsData);
      console.log("Feedbacks Data:", feedbacksData);
      console.log("Follow-ups Data:", followupsData);

      setSanctions(sanctionsData);
      setFeedbacks(feedbacksData);
      setFollowups(followupsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSanctionError("Failed to fetch sanctions.");
      setFeedbackError("Failed to fetch feedbacks.");
      setFollowupError("Failed to fetch follow-ups.");
    }
  }, [loggedInUser, authToken]);

  useEffect(() => {
    document.title = "Notification";
    fetchData(); // Fetch all data
  }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const getSanctionStatus = (isApproved) => {
    return isApproved === 1 ? "Accepted" : isApproved === 2 ? "Declined" : "Pending";
  };

  const renderSanctionsAndFeedbacks = () => {
    // Combine sanctions, feedbacks, and follow-ups, sort by date or other fields, and paginate
    const allNotifications = [...sanctions, ...feedbacks, ...followups]
      .sort((a, b) => {
        const dateA = new Date(a.timestamp || a.created_at); // Replace with actual date fields
        const dateB = new Date(b.timestamp || b.created_at);
        return dateB - dateA; // Sort newest first
      })
      .slice(startIndex, endIndex);

    if (allNotifications.length === 0) {
      return <p>No notifications available.</p>;
    }

    return (
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {allNotifications.map((item) => (
          <li
            key={item.sanction_id || item.feedback_id || item.followup_id}
            style={{ marginBottom: "16px", border: "1px solid #ccc", padding: "8px" }}
          >
            {item.sanction_id ? (
              <div>
                <b>Type:</b> Sanction <br />
                <b>Case # and Name:</b> {item.caseEntity.cid} - {item.caseEntity.case_name} <br />
                <b>Student Name:</b> {item.caseEntity.student.firstname} {item.caseEntity.student.lastname} <br />
                <b>Sanction Recommendation:</b> {item.sanctionRecommendation} <br />
                <b>Status:</b> {getSanctionStatus(item.isApproved)}
              </div>
            ) : item.fid ? (
              <div>
                <b>Type:</b> Feedback <br />
                <b>Case # and Name:</b> {item.caseEntity.cid} - {item.caseEntity.case_name} <br />
                <b>Feedback From SSO:</b> {item.result} <br />
                
              </div>
            ) : (
              <div>
                <b>Type:</b> Follow-up <br />
                <b>Case # and Name:</b> {item.caseEntity.cid} - {item.caseEntity.case_name} <br />
                <b>Student: </b> {item.caseEntity.student.firstname} {item.caseEntity.student.lastname} <br />
                <b>Action:</b> {item.action} <br />
                <b>Reasoning:</b> {item.reasoning} <br />
                <b>Date:</b> {item.date} <br />
                <b>Time:</b> {item.time} <br />
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="" className={styles["sidebar-logo"]} />
        {createSidebarLink("/report", "Record", AssessmentIcon)}
        {createSidebarLink("/student", "Student", SchoolIcon)}
        {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
        {loggedInUser.userType !== 2 && (
          <>
            {loggedInUser.userType === 3
              ? createSidebarLink("/adviserCase", "Case", PostAddIcon)
              : createSidebarLink("/case", "Case", PostAddIcon)}
          </>
        )}
         {loggedInUser.userType === 1 && createSidebarLink("/timelog", "Time Log", AccessTimeFilledIcon)}
        <button className={styles["logoutbtn"]} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className={styles.content}>
        <h1>Notifications</h1>
        {sanctionError && <p style={{ color: "red" }}>{sanctionError}</p>}
        {feedbackError && <p style={{ color: "red" }}>{feedbackError}</p>}
        {followupError && <p style={{ color: "red" }}>{followupError}</p>}
        {!sanctionError && !feedbackError && !followupError && renderSanctionsAndFeedbacks()}{" "}
        {/* Only render if no errors */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={prevPage} disabled={page === 1}>
            Previous Page
          </button>
          <span>Page {page}</span>
          <button onClick={nextPage}>Next Page</button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
