import React from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

const MenuPopupState = () => {
    const navigate = useNavigate();
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = authToken ? JSON.parse(authToken) : null;

    if (!loggedInUser) {
        console.error('User is not logged in');
        return; // You might want to redirect to login page or show a message
    }

    const user = loggedInUser;
    console.log('User object:', user);
    const handleLogout = async (popupState) => {
        console.log("Logout button clicked");
        const logoutTime = new Date().toISOString();

        if (!user.userId) {
            console.error('User ID is undefined');
            return; // Handle the error accordingly
        }

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
            popupState.close(); // Close the popup menu
            navigate('/');
        } catch (error) {
            console.error('Error logging out', error.response ? error.response.data : error.message);
        }
    };

    const handleProfileClick = () => {
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
                        <MenuItem onClick={() => handleLogout(popupState)}>Logout</MenuItem>
                    </Menu>
                </React.Fragment>
            )}
        </PopupState>
    );
};

export default MenuPopupState;
