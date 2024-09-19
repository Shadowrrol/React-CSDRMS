import React from 'react';
import axios from "axios";
import { useNavigate, } from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

const MenuPopupState = () => {
    const navigate = useNavigate();
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = JSON.parse(authToken);

    const user = loggedInUser

    let userTypeLabel;
    if (user && user.userType === 1) {
        userTypeLabel = `${user.firstname} - SSO`;
    } else if (user && user.userType === 2) {
        userTypeLabel = `${user.firstname} - Principal`;
    } else if (user && user.userType === 3) {
        userTypeLabel = `${user.firstname} - Adviser`;
    } else if (user && user.userType === 4) {
        userTypeLabel = `${user.firstname} - Admin`;
    } else {
        userTypeLabel = 'Dashboard';
    }

    const handleLogout = async () => {
        const logoutTime = new Date().toISOString();
        try {
            // Fetch timeLogId using userId
            const response = await axios.get(`http://localhost:8080/time-log/getLatestLog/${user.userId}`);
            const timeLogId = response.data.timelog_id;

            // Send logout time to backend
            await axios.post('http://localhost:8080/time-log/logout', {
                timelogId: timeLogId,
                logoutTime,
            });

            // Clear tokens and navigate to login
            localStorage.removeItem('authToken');
            navigate('/');
        } catch (error) {
            console.error('Error logging out', error);
        }
    };

    const handleProfileClick = () => {
        // Navigate to '/UpdateAccount' when profile is clicked
        navigate(`/UpdateAccount`, { state: { user } });
    };

    return (
        <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
                <React.Fragment>
                    <Button
                        variant="contained"
                        {...bindTrigger(popupState)}
                        style={{ backgroundColor: '#ffc800', color: 'black', width: '100%' }}
                    >
                        {userTypeLabel}
                    </Button>
                    <Menu {...bindMenu(popupState)}>
                        <MenuItem onClick={handleProfileClick}>Update Account</MenuItem>
                        {/* <MenuItem onClick={popupState.close}>My account</MenuItem> */}
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </React.Fragment>
            )}
        </PopupState>
    );
}

export default MenuPopupState;
