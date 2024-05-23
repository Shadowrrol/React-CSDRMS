import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "axios";
import navStyles from '../Navigation.module.css';
import { Link } from "react-router-dom";
import React, {  useEffect, useState } from "react";
import MenuPopupState from '../components/MenuPopupState';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AssessmentIcon from '@mui/icons-material/Assessment';

function Class() {
  const [classes, setClasses] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const [grades, setGrades] = useState([]);
  const [newGrade, setNewGrade] = useState("");
  const [newSection, setNewSection] = useState("");
  const [newSchoolYear, setNewSchoolYear] = useState("");
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [showAddSchoolYear, setShowAddSchoolYear] = useState(false);

  const handleOpen = () => setShowAddGrade(true);
  const handleClose = () => setShowAddGrade(false);
  const handleOpenSchoolYear = () => setShowAddSchoolYear(true);
  const handleCloseSchoolYear = () => setShowAddSchoolYear(false);

  // Function to fetch all classes from backend
  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://localhost:8080/class/getAllClasses");
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  // Function to fetch all school years from backend
  const fetchSchoolYears = async () => {
    try {
      const response = await axios.get("http://localhost:8080/schoolYear/getAllSchoolYears");
      setSchoolYears(response.data);
    } catch (error) {
      console.error("Error fetching school years:", error);
    }
  };

  // Function to fetch all grades from backend
  const fetchGrades = async () => {
    try {
      const response = await axios.get("http://localhost:8080/class/allUniqueGrades");
      setGrades(response.data);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  // Function to add a new grade and section
  const addGrade = async () => {
    if (!newGrade || !newSection) {
      alert("Please fill in all fields");
      return;
    }

    const sectionExists = classes.some(
      (classItem) => classItem.section === newSection
    );

    if (sectionExists) {
      alert("Section already exists");
      return;
    }

    try {
      await axios.post("http://localhost:8080/class/addClass", {
        grade: newGrade,
        section: newSection,
      });
      fetchClasses();
      setShowAddGrade(false); // Close the pop-up after adding the grade
    } catch (error) {
      console.error("Error adding grade:", error);
      alert("Failed to add grade and section"); // User-friendly error message
    }
  };

  // Function to add a new school year
  const addSchoolYear = async () => {
    if (!newSchoolYear) {
      alert("Please fill in all fields");
      return;
    }

    const schoolYearExists = schoolYears.some(
      (schoolYear) => schoolYear.schoolYear === newSchoolYear
    );

    if (schoolYearExists) {
      alert("School year already exists");
      return;
    }

    try {
      await axios.post("http://localhost:8080/schoolYear/addSchoolYear", {
        schoolYear: newSchoolYear,
      });
      // Refresh the school years list after adding a new school year
      fetchSchoolYears();
      setShowAddSchoolYear(false); // Close the pop-up after adding the school year
    } catch (error) {
      console.error("Error adding school year:", error);
      alert("Failed to add school year"); // User-friendly error message
    }
  };

  // Fetch classes, school years, and grades when the component mounts
  useEffect(() => {
    document.title = "SSO | Class";
    fetchClasses();
    fetchSchoolYears();
    fetchGrades();
  }, []);

  return (
    <div className={navStyles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
      <div className={navStyles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="" className={navStyles['sidebar-logo']} />
        <Link to="/AdminDashboard" className={navStyles['styled-link']}>
          <AssessmentIcon className={navStyles.icon} />
          <span className={navStyles['link-text']}>Dashboard</span>
        </Link>
        <Link to="/account" className={navStyles['styled-link']}>
          <AccountBoxIcon className={navStyles.icon} />
          <span className={navStyles['link-text']}>Account</span>
        </Link>
        <Link to="/class" className={navStyles['styled-link']}>
          <MeetingRoomIcon className={navStyles.icon} />
          <span className={navStyles['link-text']}>Class</span>
        </Link>
        <MenuPopupState />
      </div>
      <div className={navStyles.maincontent}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            height: "80%",
            border: "2px solid black",
            background: "linear-gradient(180deg, rgba(179, 63, 73, 0.8) 11.82%, #1d0809 94.83%)",
            borderRadius: "20px",
            width: "auto",
            gap: "20px",
          }}
        >
          <h2 style={{ color: "white", fontSize: "32px" }}>Classes</h2>
          <div
            style={{
              height: "50%",
              width: "95%",
              borderTop: "2px solid black",
              display: "flex",
              flexDirection: "column",
              padding: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {classes.map((classItem) => (
                <div
                  key={classItem.class_id}
                  style={{
                    display: "flex",
                    border: "1px solid black",
                    borderRadius: "12px",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "bold",
                    padding: "8px",
                    justifyContent: "center",
                    background:
                      "linear-gradient(180deg, rgba(179, 63, 73, 0.8) 11.82%, #1d0809 94.83%)",
                  }}
                >
                  <li style={{ listStyle: "none", fontWeight: "bold" }}>
                    Grade: {classItem.grade}, Section: {classItem.section}
                  </li>
                </div>
              ))}
            </div>
          </div>
          <h2 style={{ color: "white" }}>School Years</h2>

          <div
            style={{
              height: "50%",
              width: "95%",
              borderTop: "2px solid black",
              display: "flex",
              flexDirection: "column",
              padding: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              {schoolYears.map((schoolYear) => (
                <div
                  key={schoolYear.schoolYear_ID}
                  style={{
                    display: "flex",
                    border: "1px solid black",
                    borderRadius: "12px",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "bold",
                    padding: "8px",
                    justifyContent: "center",
                    background:
                      "linear-gradient(180deg, rgba(179, 63, 73, 0.8) 11.82%, #1d0809 94.83%)",
                  }}
                >
                  <li style={{ listStyle: "none" }}>
                    {schoolYear.schoolYear}
                  </li>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            padding: "8px",
            width: "100%",
            gap: "12px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Add Grade and Section Pop-up */}
          {showAddGrade ? (
            <Modal open={showAddGrade} onClose={handleClose}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 500,
                  bgcolor: "background.paper",
                  border: "2px solid #000",
                  borderRadius: 8,
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <h1 style={{ margin: "0 auto" }}>Add Grade & Section</h1>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <input
                      type="number"
                      value={newGrade}
                      onChange={(e) => setNewGrade(e.target.value)}
                      placeholder="Enter grade"
                    />
                    <input
                      type="text"
                      value={newSection}
                      onChange={(e) => setNewSection(e.target.value)}
                      placeholder="Enter section"
                    />
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={addGrade}>Add Grade & Section</button>
                    <button onClick={() => handleClose()}>Cancel</button>
                  </div>
                </div>
              </Box>
            </Modal>
          ) : (
            <button onClick={handleOpen}>Add Grade & Section</button>
          )}

          {/* Add School Year Pop-up */}
          {showAddSchoolYear ? (
            <Modal open={showAddSchoolYear} onClose={handleCloseSchoolYear}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 500,
                  bgcolor: "background.paper",
                  border: "2px solid #000",
                  borderRadius: 8,
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <h1 style={{ margin: "0 auto" }}>Add School Year</h1>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <input
                      type="text"
                      value={newSchoolYear}
                      onChange={(e) => setNewSchoolYear(e.target.value)}
                      placeholder="Enter school year"
                    />
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={addSchoolYear}>Add School Year</button>
                    <button onClick={() => handleCloseSchoolYear()}>Cancel</button>
                  </div>
                </div>
              </Box>
            </Modal>
          ) : (
            <button onClick={handleOpenSchoolYear}>Add School Year</button>
          )}
          {/* Buttons to show pop-ups */}
        </div>
      </div>
    </div>
  );
}

export default Class;
