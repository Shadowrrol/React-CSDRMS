import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import navigationStyles from '../Navigation.module.css';
import caseStyles from './Case.module.css';
import modalStyles from './Modal.module.css';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';

const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={navigationStyles['styled-link']}>
        <IconComponent className={navigationStyles.icon} />
        <span className={navigationStyles['link-text']}>{text}</span>
    </Link>
);

const Case = () => {
    const navigate = useNavigate(); 
  const handleLogout = () => {
    // Clear the authentication token from localStorage
    localStorage.removeItem('authToken');
    // Redirect the user to the login page
    navigate('/');
  };
    const [cases, setCases] = useState([]);
    const [selectedCaseId, setSelectedCaseId] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        sid: '',
        case_name: '',
        investigator: '',
        violation: '',
        description: '',
        status: ''
    });

    // Fetch cases from the API
    useEffect(() => {
        const fetchCases = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/cases');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCases(data);
            } catch (error) {
                console.error('Failed to fetch cases:', error);
            }
        };
        fetchCases();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/cases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const newCase = await response.json();
                setCases((prevCases) => [...prevCases, newCase]);
                setFormData({ sid: '', case_name: '', investigator: '', violation: '', description: '', status: '' });
                setModalOpen(false); // Close the modal
            } else {
                console.error('Failed to add case');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleDelete = async () => {
        if (selectedCaseId === null) {
            console.warn("No case selected for deletion");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/cases/${selectedCaseId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setCases((prevCases) => prevCases.filter((caseItem) => caseItem.cid !== selectedCaseId));
                setSelectedCaseId(null); // Clear the selected case after deletion
            } else {
                console.error('Failed to delete case');
            }
        } catch (error) {
            console.error('Error deleting case:', error);
        }
    };

    const selectCase = (id) => {
        setSelectedCaseId(id);
    };

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const location = useLocation();
    const userInfo = location.state ? location.state.userInfo : null;

    return (
        <div className={navigationStyles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
            <div className={navigationStyles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={navigationStyles['sidebar-logo']} />
                {createSidebarLink("/account", "Account", AccountBoxIcon)}
                {createSidebarLink("/student", "Student", SchoolIcon)}
                {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
                {createSidebarLink("/case", "Case", PostAddIcon)}
                {createSidebarLink("/pendings", "Pendings", PendingActionsIcon)}
                {createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
                {createSidebarLink("/report", "Report", AssessmentIcon)}
                <button className={navigationStyles['logoutbtn']} onClick={handleLogout}>Logout</button>
            </div>
            <div className={navigationStyles.content}>
                <div className={caseStyles['case-container']}>
                    <h1>Case List</h1>
                    <table className={caseStyles['case-table']}>
                        <thead>
                            <tr>
                                <th>Case#</th>
                                <th>StudentID</th>
                                <th>Case Name</th>
                                <th>Investigator</th>
                                <th>Violation</th>
                                <th>Description</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cases.map((caseItem) => (
                                <tr
                                    key={caseItem.cid}
                                    onClick={() => selectCase(caseItem.cid)}
                                    className={selectedCaseId === caseItem.cid ? caseStyles['selected-row'] : ''}
                                >
                                    <td>{caseItem.cid}</td>
                                    <td>{caseItem.sid}</td>
                                    <td>{caseItem.case_name}</td>
                                    <td>{caseItem.investigator}</td>
                                    <td>{caseItem.violation}</td>
                                    <td>{caseItem.description}</td>
                                    <td className={caseItem.status === "Complete" ? caseStyles['status-complete'] : caseStyles['status-ongoing']}>
                                        {caseItem.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={openModal} className={caseStyles['add-case']}>Add Case</button>
                    <button onClick={handleDelete} className={caseStyles['delete-case']} disabled={selectedCaseId === null}>Delete Case</button>

                    {isModalOpen && (
                        <div className={modalStyles.overlay}>
                            <div className={modalStyles.modal}>
                                <button onClick={closeModal} className={modalStyles.closeButton}>✖</button>
                                <form onSubmit={handleSubmit} className={caseStyles['add-case-form']}>
                                    <input name="sid" value={formData.sid} onChange={handleInputChange} placeholder="Student ID" required />
                                    <input name="case_name" value={formData.case_name} onChange={handleInputChange} placeholder="Case Name" required />
                                    <input name="investigator" value={formData.investigator} onChange={handleInputChange} placeholder="Investigator" required />
                                    <input name="violation" value={formData.violation} onChange={handleInputChange} placeholder="Violation" required />
                                    <input name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" required />
                                    <input name="status" value={formData.status} onChange={handleInputChange} placeholder="Status" required />
                                    <button type="submit">Add Case</button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Case;
