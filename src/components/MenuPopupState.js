import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { AuthContext } from '../AuthContext'; // Adjust the path as needed

const MenuPopupState = () => {
    const navigate = useNavigate();
    const { loggedInUser } = useContext(AuthContext);

    if (!loggedInUser) {
        console.error('User is not logged in');
        navigate('/login'); // Navigate to login page if not logged in
        return null;
    }

    const user = loggedInUser;

    console.log('Current user:', user); // Log the current user object
    if (!user.userId) {
        console.error('User ID is undefined', user); // Log if userId is missing
    }

    // Set the label based on user type, and include the user's last name
    const userTypeLabel = `${user.lastName} ${user.userType === 1 ? " | SSO Officer" : 
                                           user.userType === 2 ? " | Principal" : 
                                           user.userType === 3 ? " | Adviser" : 
                                           user.userType === 4 ? " | Admin" : ""}`;

    const handleLogout = async (popupState) => {
        console.log("Logout button clicked");
        const logoutTime = new Date().toISOString();

        if (!user.userId) {
            console.error('User ID is undefined');
            return;
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
