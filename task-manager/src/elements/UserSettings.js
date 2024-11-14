import React, { useState, useEffect, useCallback } from 'react';
import { getUser, updateUser, deleteUser } from '../api';
import { jwtDecode } from 'jwt-decode';
import "core-js/stable/atob";
import '../style/Style.css'; // Assuming you have a CSS file for styling

const getUsernameFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Token", decoded);
    return decoded.sub; // assuming "sub" holds the username
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

const Settings = () => {
  const token = localStorage.getItem('jwt');
  const [user, setUser] = useState({
    username: '',
    email: '',
    enableNotifications: false,
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const currentUsername = getUsernameFromToken(token);

  const fetchUserSettings = useCallback(async () => {
    try {
      if (currentUsername && token) {
        console.log('Fetching user settings for:', currentUsername);
        const response = await getUser(currentUsername); // Token is automatically added by interceptor
        console.log('User settings fetched:', response.data);
        setUser({
          ...response.data,
          enableNotifications: response.data.enableNotifications ?? false, // Ensure boolean value
        });
      } else {
        console.log('No currentUsername or token');
      }
    } catch (error) {
      console.error('Error fetching user settings', error);
    }
  }, [currentUsername, token]);
  
  useEffect(() => {
    console.log('useEffect - currentUsername:', currentUsername, 'token:', token);
    fetchUserSettings();
  }, [fetchUserSettings, currentUsername, token]);
  

  const handleSaveSettings = async () => {
    try {
      if (currentUsername && token) {
        console.log('Saving user settings for:', currentUsername);
        if (passwords.newPassword !== passwords.confirmPassword) {
          alert('New password and confirm password do not match');
          return;
        }
        await updateUser(currentUsername, { ...user, password: passwords.newPassword }); // Token is automatically added by interceptor
        alert('Settings saved successfully');
      } else {
        console.log('No currentUsername or token');
      }
    } catch (error) {
      console.error('Error saving settings', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (currentUsername && token) {
        const confirmationUsername = prompt('Please enter your username to confirm account deletion:');
        if (confirmationUsername !== currentUsername) {
          alert('Username does not match. Account deletion cancelled.');
          return;
        }
        console.log('Deleting account for:', currentUsername);
        await deleteUser(currentUsername); // Token is automatically added by interceptor
        alert('Account deleted successfully');
        localStorage.removeItem('jwt'); // Remove token from local storage
        window.location.reload(); // Reload the page to log out the user
      } else {
        console.log('No currentUsername or token');
      }
    } catch (error) {
      console.error('Error deleting account', error);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">Settings</div>
      <div className="settings-section">
        <h2>Account Information</h2>
        <label>
          Username:
          <input
            type="text"
            value={user.username}
            disabled
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </label>
      </div>
      <div className="settings-section">
        <h2>Password</h2>
        <label>
          Current Password:
          <input
            type="password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          />
        </label>
        <label>
          Confirm New Password:
          <input
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
          />
        </label>
      </div>
      <div className="settings-section">
        <h2>Notifications</h2>
        <label>
          <input
            type="checkbox"
            checked={user.enableNotifications}
            onChange={() => setUser({ ...user, enableNotifications: !user.enableNotifications })}
          />
          Enable Notifications
        </label>
      </div>
      <button className="settings-button" onClick={handleSaveSettings}>Save</button>
      <button className="settings-button" onClick={handleDeleteAccount} style={{ marginLeft: '10px', backgroundColor: 'red' }}>Delete Account</button>
    </div>
  );
};

export default Settings;