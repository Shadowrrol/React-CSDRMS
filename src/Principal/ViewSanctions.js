import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../Navigation.module.css"; // Import CSS module

import AssessmentIcon from "@mui/icons-material/Assessment";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";

const ViewSanctions = () => {
  const navigate = useNavigate();
  const [sanctions, setSanctions] = useState([]);

  useEffect(() => {
    const fetchSanctions = async () => {
      try {
        const response = await axios.get("http://localhost:8080/sanction/getAllPendingSanctions");
        console.log("Fetched sanctions:", response.data);
        setSanctions(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchSanctions();
  }, []);

  const handleLogout = () => {
    // Clear the authentication token from localStorage
    localStorage.removeItem("authToken");
    // Redirect the user to the login page
    navigate("/");
  };

  const handleApprove = async (sanctionId) => {
    try {
      const response = await axios.post("http://localhost:8080/sanction/approveSanction", null, {
        params: {
          sanctionId: sanctionId,
        },
      });
      console.log(response.data); // log response from the server
      // Refresh sanctions after approval
      const updatedSanctions = sanctions.map((sanction) => {
        if (sanction.sanction_id === sanctionId) {
          sanction.isApproved = 1;
        }
        return sanction;
      });
      setSanctions(updatedSanctions);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDecline = async (sanctionId) => {
    try {
      const response = await axios.post("http://localhost:8080/sanction/declineSanction", null, {
        params: {
          sanctionId: sanctionId,
        },
      });
      console.log(response.data); // log response from the server
      // Refresh sanctions after approval
      const updatedSanctions = sanctions.map((sanction) => {
        if (sanction.sanction_id === sanctionId) {
          sanction.isApproved = 2;
        }
        return sanction;
      });
      setSanctions(updatedSanctions);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.wrapper} style={{ backgroundImage: "url(/public/image-2-3@2x.png)" }}>
      <div className={styles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="" className={styles["sidebar-logo"]} />
        <Link to="/report" className={styles["styled-link"]}>
          <AssessmentIcon className={styles.icon} />
          <span className={styles["link-text"]}>Report</span>
        </Link>
        <Link to="/viewSanctions" className={styles["styled-link"]}>
          <LocalPoliceIcon className={styles.icon} />
          <span className={styles["link-text"]}>Sanctions</span>
        </Link>
        <button className={styles["logoutbtn"]} onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="content">
        <h1>Sanctions</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            background: "linear-gradient(to top, rgba(100,0,0,.9), rgba(100,0,0,0.3))",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              width: "160vh",
              border: "2px solid black",
              borderRadius: "12px",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#a02727",
            }}
          >
            <h2 style={{ color: "white" }}>All Sanctions</h2>
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
              <div style={{ width: "90hv", display: "flex" }}>
                <div
                  style={{
                    border: "1px black solid",
                    width: "80vh",
                    borderRadius: "15px",
                    background: "linear-gradient(to right, #a43737 40%, #e8bd26 95%)",
                  }}
                >
                  <li key={sanction.sanction_id} style={{ listStyle: "none" }}>
                    {/* Display sanction details */}
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
                          alignItems: "flex-start",
                          padding: "8px",
                          gap: "8px",
                        }}
                      >
                        <div>Sanction ID: {sanction.sanction_id}</div>
                        <div>
                          Student Name: {sanction.student.firstname} {sanction.student.lastname}
                        </div>
                        <div>Behavior Details: {sanction.behaviorDetails}</div>
                        <div>Sanction Recommendation: {sanction.sanctionRecommendation}</div>
                      </div>
                      {/* Approve and decline buttons */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "15px",
                        }}
                      >
                        {sanction.isApproved !== 1 && (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => handleApprove(sanction.sanction_id)}>
                              Approve
                            </button>
                            <button onClick={() => handleDecline(sanction.sanction_id)}>
                              Decline
                            </button>
                          </div>
                        )}
                        {/* View associated cases, sanctions, and records */}
                      </div>
                    </div>
                  </li>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "center",
                    marginLeft: "4px",
                  }}
                >
                  <button
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      backgroundColor: "#861b1c;",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px",
                      fontSize: "16px",
                    }}
                  >
                    <Link
                      style={{ color: "inherit", textDecoration: "none" }}
                      to={`/view-student-cases/${sanction.sid}`}
                    >
                      View Cases
                    </Link>
                  </button>

                  <button
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      backgroundColor: "#861b1c;",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px",
                      fontSize: "16px",
                    }}
                  >
                    <Link
                      style={{ color: "inherit", textDecoration: "none" }}
                      to={`/view-student-report/${sanction.sid}`}
                    >
                      View Records
                    </Link>
                  </button>
                  <button
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      backgroundColor: "#861b1c;",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px",
                      fontSize: "16px",
                    }}
                  >
                    <Link
                      style={{ color: "inherit", textDecoration: "none" }}
                      to={`/view-student-sanctions/${sanction.sid}`}
                    >
                      View Sanctions
                    </Link>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSanctions;
