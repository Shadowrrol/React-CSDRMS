import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "axios";
import navStyles from '../Navigation.module.css';
import classStyles from './Class.module.css';
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import MenuPopupState from '../components/MenuPopupState';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AssessmentIcon from '@mui/icons-material/Assessment';

// Function to create sidebar links with icons
const createSidebarLink = (to, text, IconComponent) => (
  <Link to={to} className={navStyles['styled-link']} key={to}>
    <IconComponent className={navStyles.icon} />
    <span>{text}</span>
  </Link>
);

function Class() {
  const [classes, setClasses] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const [newGrade, setNewGrade] = useState("");
  const [newSection, setNewSection] = useState("");
  const [newSchoolYear, setNewSchoolYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [showAddSchoolYear, setShowAddSchoolYear] = useState(false);

  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;

  const handleOpen = () => setShowAddGrade(true);
  const handleClose = () => setShowAddGrade(false);
  const handleOpenSchoolYear = () => setShowAddSchoolYear(true);
  const handleCloseSchoolYear = () => setShowAddSchoolYear(false);

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://localhost:8080/class/getAllClasses");
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchSchoolYears = async () => {
    try {
      const response = await axios.get("http://localhost:8080/schoolYear/getAllSchoolYears");
      setSchoolYears(response.data);
    } catch (error) {
      console.error("Error fetching school years:", error);
    }
  };

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
      // Send the grade as a string (like G7, G8)
      await axios.post("http://localhost:8080/class/addClass", {
        grade: newGrade,  // Grade as a string (G7, G8, etc.)
        section: newSection,
      });
      fetchClasses(); // Refresh classes after adding
      handleClose();
    } catch (error) {
      console.error("Error adding grade:", error);
      alert("Failed to add grade and section");
    }
  };

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
      fetchSchoolYears(); // Refresh school years after adding
      handleCloseSchoolYear();
    } catch (error) {
      console.error("Error adding school year:", error);
      alert("Failed to add school year");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredClasses = classes
    .filter((classItem) => {
      const gradeMatch = classItem.grade?.toString().includes(searchTerm);
      const sectionMatch = classItem.section?.toLowerCase().includes(searchTerm.toLowerCase());
      return gradeMatch || sectionMatch;
    })
    .sort((a, b) => a.grade.localeCompare(b.grade)); // Use localeCompare for sorting strings

  const filteredSchoolYears = schoolYears
    .filter((schoolYear) => schoolYear.schoolYear?.includes(searchTerm));

  useEffect(() => {
    document.title = "Admin | Class";
    fetchClasses();
    fetchSchoolYears();
  }, [loggedInUser]);

  return (
    <div className={navStyles.wrapper}>
      <div className={navStyles.sidenav}>
        <img src="/image-removebg-preview (1).png" alt="logo" className={navStyles['sidebar-logo']} />
        {createSidebarLink("/AdminDashboard", "Dashboard", AssessmentIcon)}
        {createSidebarLink("/class", "Class", MeetingRoomIcon)}
        <MenuPopupState />
      </div>

      <div className={navStyles.content}>
        <h1 className={classStyles.classtitle}>Class Management</h1>

        <div className={classStyles.divide}>
          <div className={classStyles.tableContainer}>
            <div className={classStyles.table}>
              <table className={classStyles.tableInner}>
                <thead>
                  <tr>
                    <th>Grade & Section</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((classItem) => (
                      <tr key={classItem.class_id}>
                        <td>{`${classItem.grade} - ${classItem.section}`}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className={classStyles.noresult}>No Results Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={classStyles.tableContainer}>
            <div className={classStyles.table}>
              <table className={classStyles.tableInner}>
                <thead>
                  <tr>
                    <th>School Year</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchoolYears.length > 0 ? (
                    filteredSchoolYears.map((schoolYear) => (
                      <tr key={schoolYear.schoolYear_ID}>
                        <td>{schoolYear.schoolYear}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className={classStyles.noresult}>No Results Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Grade Modal */}
        <Modal open={showAddGrade} onClose={handleClose}>
          <Box className={classStyles.modalContainer}>
            <h2 className={classStyles.modalHeader}>Add New Grade and Section</h2>
            <select
              className={classStyles.inputField}
              value={newGrade}
              onChange={(e) => setNewGrade(e.target.value)}
            >
              <option value="">Select Grade</option>
              <option value="G7">Grade 7</option>
              <option value="G8">Grade 8</option>
              <option value="G9">Grade 9</option>
              <option value="G10">Grade 10</option>
            </select>
            <input
              type="text"
              className={classStyles.inputField}
              placeholder="Enter Section"
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
            />
            <div className={classStyles.buttonGroup}>
              <button onClick={addGrade} className={classStyles.button}>Add</button>
              <button onClick={handleClose} className={`${classStyles.button} ${classStyles.buttonCancel}`}>Cancel</button>
            </div>
          </Box>
        </Modal>

        {/* Add School Year Modal */}
        <Modal open={showAddSchoolYear} onClose={handleCloseSchoolYear}>
          <Box className={classStyles.modalContainer}>
            <h2 className={classStyles.modalHeader}>Add New School Year</h2>
            <input
              type="text"
              className={classStyles.inputField}
              placeholder="Enter School Year"
              value={newSchoolYear}
              onChange={(e) => setNewSchoolYear(e.target.value)}
            />
            <div className={classStyles.buttonGroup}>
              <button onClick={addSchoolYear} className={classStyles.button}>Add</button>
              <button onClick={handleCloseSchoolYear} className={`${classStyles.button} ${classStyles.buttonCancel}`}>Cancel</button>
            </div>
          </Box>
        </Modal>

        <div className={classStyles.addButtonContainer}>
          <button onClick={handleOpen} className={classStyles.button}>Add Grade</button>
          <button onClick={handleOpenSchoolYear} className={classStyles.button}>Add School Year</button>
          <div className={classStyles.searchContainer}>
            <input
              type="search"
              placeholder="Search by Grade, Section or School Year..."
              className={classStyles.searchInput}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Class;
