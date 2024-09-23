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


const createSidebarLink = (to, text, IconComponent) => (
  <Link to={to} className={navStyles['styled-link']}>
      <IconComponent className={navStyles.icon} />
      <span className={navStyles['link-text']}>{text}</span>
  </Link>
);

function ButtonMenu({ sanctionId, index }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        style={{
          backgroundColor: "#861b1c",
          color: "white",
          fontWeight: "bold",
          border: "none",
        }}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Supporting Documents
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>
          <Link
            style={{ color: "inherit", textDecoration: "none" }}
            to={`/view-student-cases/${sanctionId}`}
          >
            View Cases
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link
            style={{ color: "inherit", textDecoration: "none" }}
            to={`/view-student-report/${sanctionId}`}
          >
            View Records
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link
            style={{ color: "inherit", textDecoration: "none" }}
            to={`/view-student-sanctions/${sanctionId}`}
          >
            View Sanctions
          </Link>
        </MenuItem>
      </Menu>
    </div>
  );
}
const ViewSanctions = () => {
  const navigate = useNavigate();
  const [sanctions, setSanctions] = useState([]);

  useEffect(() => {
    const fetchSanctions = async () => {
      try {
        const response = await axios.get("http://localhost:8080/sanction/getAllSanctions");
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

  const [page, setPage] = useState(1);
  const limit = 4;

  const nextPage = () => setPage(page + 1);
  const prevPage = () => setPage(page > 1 ? page - 1 : page);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return (
    <div className={navStyles.wrapper} >
      <div className={navStyles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="" className={navStyles["sidebar-logo"]} />
        {createSidebarLink("/record", "Record", AssessmentIcon)}
        {createSidebarLink("/viewSanctions", "Sanctions", LocalPoliceIcon)}
        <button className={navStyles["logoutbtn"]} onClick={handleLogout}>
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
            {sanctions.slice(startIndex, endIndex).map((sanction) => (
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
                      <div className={styles1.gridItem} style={{ color: "white" }}>
                        <span className={styles1.label} style={{ color: "white" }}>
                          Sanction ID:
                        </span>{" "}
                        {sanction.caseEntity.student.sid}
                      </div>
                      <div className={styles1.gridItem} style={{ color: "white" }}>
                        <span className={styles1.label} style={{ color: "white" }}>
                          Student Name:
                        </span>{" "}
                        {sanction.caseEntity.student.firstname} {sanction.caseEntity.student.lastname}
                      </div>
                      <div className={styles1.gridItem} style={{ color: "white" }}>
                        <span className={styles1.label} style={{ color: "white" }}>
                          Case:
                        </span>{" "}
                        {sanction.caseEntity.case_name}
                      </div>
                      <div className={styles1.gridItem} style={{ color: "white" }}>
                        <span className={styles1.label} style={{ color: "white" }}>
                          Description:
                        </span>{" "}
                        {sanction.caseEntity.description}
                      </div>
                      <div className={styles1.gridItem} style={{ color: "white" }}>
                        <span className={styles1.label} style={{ color: "white" }}>
                          Violation:
                        </span>{" "}
                        {sanction.caseEntity.violation}
                      </div>
                      <div className={styles1.gridItem} style={{ color: "white" }}>
                        <span className={styles1.label} style={{ color: "white" }}>
                          Sanction Recommendation:
                        </span>{" "}
                        {sanction.sanctionRecommendation}
                      </div>
                    </div>
                    {/* Approve and decline buttons */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
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

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "start",
                          justifyContent: "center",
                          marginLeft: "4px",
                        }}
                      >
                        <ButtonMenu key={sanction.id} sanctionId={sanction.sid} />
                      </div>
                    </div>
                  </div>
                </li>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {page === 1 ? "" : <button onClick={prevPage}>Previous Page</button>}
              <span style={{ color: "white" }}>Page {page}</span>
              <button onClick={nextPage}>Next Page</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSanctions;
