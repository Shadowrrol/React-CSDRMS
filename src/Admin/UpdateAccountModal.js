import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import styles from './RegisterUserModal.module.css';
import styles1 from '../GlobalForm.module.css';

const UpdateAccountModal = ({ isOpen, onClose, user }) => {
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = authToken ? JSON.parse(authToken) : null;

    const [userType, setUserType] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        email: '',
        userType: null,
        schoolYear: '',
        grade: null,
        section: ''
    });

    useEffect(() => {
        if (isOpen && user) {
            setUpdatedUser({
                username: user.username,
                password: '',
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                userType: user.userType,
                schoolYear: user.schoolYear || '',
                grade: user.grade || null,
                section: user.section || ''
            });
            setUserType(user.userType);
        }
    }, [isOpen, user]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUpdatedUser({ ...updatedUser, [name]: value });
    };

    const handleUpdate = () => {
        const updatedData = { ...updatedUser };
    
        // If the password field is empty, remove it from the object to avoid updating
        if (updatedData.password === '') {
            delete updatedData.password;
        }
    
        const endpoint = updatedUser.userType === 1 ? 'updateSSO' :
                         updatedUser.userType === 2 ? 'updatePrincipal' :
                         updatedUser.userType === 3 ? 'updateAdviser' :
                         updatedUser.userType === 4 ? 'updateAdmin' :
                         updatedUser.userType === 5 ? 'updateTeacher' :    // Teacher role
                         updatedUser.userType === 6 ? 'updateGuidance' : '';  // Guidance role
    
        if (endpoint) {
            axios.put(`http://localhost:8080/user/${endpoint}`, updatedData)
                .then(response => {
                    console.log(response.data);
                    alert('Account Successfully Updated');
    
                    if (updatedUser.username === loggedInUser.username) {
                        localStorage.setItem('authToken', JSON.stringify(updatedUser));
                    }
                    
                    onClose(); // Close the modal
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error updating user:', error);
                    alert('Error updating account. Please try again.');
                });
        }
    };
    


    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className={styles['modal-overlay']} onClick={onClose}>
            <div className={styles['modal-content']} onClick={e => e.stopPropagation()}>
                <button className={styles['modal-close-button']} onClick={onClose}>X</button>
                <h2>Update Account</h2>
                <form className={styles1['form-container']}>
                    <div className={styles1['form-group']}>
                        <label>Username:</label>
                        <input type="text" name="username" value={updatedUser.username} onChange={handleInputChange} disabled style={{ cursor: 'not-allowed' }}/>
                    </div>
                    <div className={styles1['form-group']}>
                        <label>Password:</label>
                        <input type="password" name="password" value={updatedUser.password} onChange={handleInputChange} />
                    </div>
                    <div className={styles1['form-group']}>
                        <label>First Name:</label>
                        <input type="text" name="firstname" value={updatedUser.firstname} onChange={handleInputChange} />
                    </div>
                    <div className={styles1['form-group']}>
                        <label>Last Name:</label>
                        <input type="text" name="lastname" value={updatedUser.lastname} onChange={handleInputChange} />
                    </div>
                    <div className={styles1['form-group']}>
                        <label>Email:</label>
                        <input type="email" name="email" value={updatedUser.email} onChange={handleInputChange} />
                    </div>
                    {userType === 3 && (
                        <div>
                            <div className={styles1['form-group']}>
                                <label>School Year:</label>
                                <input type="text" name="schoolYear" value={updatedUser.schoolYear} onChange={handleInputChange} />
                            </div>
                            <div className={styles1['form-group']}>
                                <label>Grade:</label>
                                <input type="number" name="grade" value={updatedUser.grade} onChange={handleInputChange} />
                            </div>
                            <div className={styles1['form-group']}>
                                <label>Section:</label>
                                <input type="text" name="section" value={updatedUser.section} onChange={handleInputChange} />
                            </div>
                        </div>
                    )}
                    <div className={styles1['global-buttonGroup']}>
                        <button type="button" className={styles1['global-button']} onClick={handleUpdate}>Update</button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default UpdateAccountModal;
