import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

const MenuPopupState = () => {
    const navigate = useNavigate();
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = JSON.parse(authToken);

    let userTypeLabel;
    if (loggedInUser && loggedInUser.userType === 1) {
        userTypeLabel = `${loggedInUser.firstname} - SSO`;
    } else if (loggedInUser && loggedInUser.userType === 2) {
        userTypeLabel = `${loggedInUser.firstname} - Principal`;
    } else if (loggedInUser && loggedInUser.userType === 3) {
        userTypeLabel = `${loggedInUser.firstname} - Adviser`;
    } else {
        userTypeLabel = 'Dashboard';
    }

    const handleLogout = () => {
        // Implement logout functionality, e.g., clear tokens
        localStorage.removeItem('authToken');
        // Then navigate to the login page
        navigate('/');
      };

    const handleProfileClick = () => {
        // Navigate to '/UpdateAccount' when profile is clicked
        navigate('/UpdateAccount');
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
