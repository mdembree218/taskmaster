import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login as loginApi } from '../api';
import '../style/Style.css';

const Login = () => {
  const [user, setUser] = useState({ username: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginApi(user);
      login(response.data.jwt); // Store the JWT token
      setUser({ username: '', password: '' }); // Clear form
    } catch (error) {
      console.error('Login failed', error);
      navigate('/login'); // Redirect to login page on failure
    }
  };

  return (
    <div className="login-container">
      <h2>Task Master</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
        </div>
        <button className="login-button" type="submit">Log In</button>
        <div className="form-group">
          <label className="no-account-label">Don't have an account?</label>
          <a href="/register" className="register-link">
            Create an account today!
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;