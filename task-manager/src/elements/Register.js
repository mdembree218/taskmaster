import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import '../style/Style.css'; // Assuming you have a CSS file for styling

const Register = () => {
  const [user, setUser] = useState({ userId: 0, email: '', username: '', password: '', enableNotifications: true });
  const [repeatPassword, setRepeatPassword] = useState('');
  const [pwNotMatch, setPwNotMatch] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (user.password !== repeatPassword) {
      setPwNotMatch(true);
      setSuccess(false);
      setFailure(false);
      return;
    }
    setPwNotMatch(false);
    try {
      await registerUser(user);
      setUser({ userId: 0, email: '', username: '', password: '', enableNotifications: true });
      setRepeatPassword('');
      setSuccess(true);
      setFailure(false);
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error('Registration failed', error);
      setSuccess(false);
      setFailure(true);
    }
  };

  return (
    <div className="container">
      <h1>Task Master</h1>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="username">Enter Username:</label>
          <input
            type="text"
            id="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Enter Email:</label>
          <input
            type="email"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Enter Password:</label>
          <input
            type="password"
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="repeat-password">Repeat Password:</label>
          <input
            type="password"
            id="repeat-password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />
        </div>
        <input type="submit" value="Create Account" />
        {pwNotMatch && <p className="error-message">Passwords do not match</p>}
        {success && <p className="success-message">Account successfully created!</p>}
        {failure && <p className="error-message">Something went wrong</p>}
      </form>
      <a href="/">
        <button className="back-button" type="button">Back</button>
      </a>
    </div>
  );
};

export default Register;