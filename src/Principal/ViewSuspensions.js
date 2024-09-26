import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles1 from "../GlobalDesign.module.css";
import navStyles from "../Navigation.module.css"; // Import CSS module

import AssessmentIcon from "@mui/icons-material/Assessment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";




const ViewSuspensions = () => {
  const [suspensions, setSuspensions] = useState([]); // State to store fetched suspensions
  const [loading, setLoading] = useState(false); // Loading state for fetching suspensions
  const [error, setError] = useState(null); // Error state to capture any API errors
  const navigate = useNavigate();
  // Fetch suspensions when the component is mounted
  useEffect(() => {
    fetchSuspensions();
  }, []);

  const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={navStyles['styled-link']}>
        <IconComponent className={navStyles.icon} />
        <span className={navStyles['link-text']}>{text}</span>
    </Link>
  );

  const handleLogout = () => {
    // Clear the authentication token from localStorage
    localStorage.removeItem("authToken");
    // Redirect the user to the login page
    navigate("/");
  };

  // Function to fetch all suspensions
  const fetchSuspensions = async () => {
    setLoading(true); // Set loading state to true
    setError(null); // Reset any previous errors
    try {
      const response = await axios.get('http://localhost:8080/suspension/getAllSuspensions'); // Fetch data from backend
      setSuspensions(response.data); // Store the suspensions data in state
    } catch (error) {
      console.error('Error fetching suspensions:', error);
      setError('Failed to fetch suspensions. Please try again later.'); // Set error message
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  return (
    <div  className={navStyles.wrapper} >
      <div className={navStyles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="" className={navStyles["sidebar-logo"]} />
        {createSidebarLink("/record", "Record", AssessmentIcon)}
        {createSidebarLink("/viewSuspensions", "Suspensions", LocalPoliceIcon)}
        <button className={navStyles["logoutbtn"]} onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="content">
      <h2>Suspension List</h2>
      {/* Loading state */}
      {loading && <p>Loading suspensions...</p>}

      {/* Error state */}
      {error && <p>{error}</p>}

      {/* Suspension List Table */}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Date Submitted</th>
              <th>Number of Days</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Return Date</th>
              <th>Report ID</th>
              <th>Complaint</th>
              <th>Student</th>
              <th>Adviser</th>
            </tr>
          </thead>
          <tbody>
            {suspensions.length > 0 ? (
              suspensions.map((suspension) => (
                <tr key={suspension.suspensionId}>
                  <td>{suspension.dateSubmitted}</td>
                  <td>{suspension.days}</td>
                  <td>{suspension.startDate}</td>
                  <td>{suspension.endDate}</td>
                  <td>{suspension.returnDate}</td>
                  <td>{suspension.reportEntity.reportId}</td>
                  <td>{suspension.reportEntity.complaint}</td>
                  <td>
                    {suspension.reportEntity.student.firstname} {suspension.reportEntity.student.lastname}
                  </td>
                  <td>
                    {suspension.reportEntity.adviser.firstname} {suspension.reportEntity.adviser.lastname}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No suspensions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      </div>
    </div>
  );
};

export default ViewSuspensions;
