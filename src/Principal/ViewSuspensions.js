import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import navStyles from "../Navigation.module.css"; // Import CSS module
import Navigation from '../Navigation'; // Import the Navigation component
import Button from "@mui/material/Button";
import SuspensionModal from "./SuspensionModal"; // Import the modal component

const ViewSuspensions = () => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = JSON.parse(authToken);
  const [suspensions, setSuspensions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSuspension, setSelectedSuspension] = useState(null); // State to store the selected suspension
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const navigate = useNavigate();

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
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const fetchSuspensions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/suspension/getAllSuspensions');
      setSuspensions(response.data);
    } catch (error) {
      console.error('Error fetching suspensions:', error);
      setError('Failed to fetch suspensions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Open the modal and set the selected suspension
  const handleViewClick = (suspension) => {
    setSelectedSuspension(suspension);
    setIsModalOpen(true);
  };

  return (
    <div className={navStyles.wrapper}>
      <Navigation loggedInUser={loggedInUser} />

      <div className={navStyles.content}>
        <h2>Suspension List</h2>
        {loading && <p>Loading suspensions...</p>}
        {error && <p>{error}</p>}
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
                <th>Actions</th>
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
                    <td>
                      <Button variant="contained" onClick={() => handleViewClick(suspension)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No suspensions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Suspension Modal */}
        {selectedSuspension && (
          <SuspensionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            suspension={selectedSuspension}
          />
        )}
      </div>
    </div>
  );
};

export default ViewSuspensions;
