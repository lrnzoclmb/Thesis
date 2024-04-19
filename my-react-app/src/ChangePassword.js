import React, { useState } from 'react';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import './changepass.css';
import NavBar from './NavBar';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChangePassword = async (event) => {
        event.preventDefault();

        // Validate that the new password and confirmation password match
        if (newPassword !== confirmPassword) {
            setError('New password and confirmation password do not match.');
            return;
        }

        const user = auth.currentUser;

        if (!user) {
            setError('No user is logged in.');
            return;
        }

        try {
            // Reauthenticate the user
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Update the user's password
            await updatePassword(user, newPassword);

            // If the password update is successful
            setSuccess('Password updated successfully!');
            setError('');
            // Optionally navigate to another page
            navigate('/');
        } catch (error) {
            console.error('Error updating password:', error);
            setError(`Error updating password: ${error.message}`);
            setSuccess('');
        }
    };

    return (
        <>
            <NavBar />
            <div className="change_password_container">
                <h2>Change Password</h2>
                <form onSubmit={handleChangePassword}>
                    <div className="input-group">
                        <label htmlFor="currentPassword">Current Password:</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="newPassword">New Password:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div class="input-group">
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Change Password</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </div>
        </>
    );
};

export default ChangePassword;
