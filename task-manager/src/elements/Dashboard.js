// src/elements/Dashboard.js
import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../style/Style.css'; // Assuming you have a CSS file for styling
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {  
  const { logout } = useContext(AuthContext);
  return (
    <div className="dashboard-container">
      <div className="header">Dashboard</div>
      <nav className="dashboard-nav">
        <ul>
          <li><Link to="/tasks" className="button">Tasks</Link></li>
          <li><Link to="/categories" className="button">Categories</Link></li>
          <li><Link to="/settings" className="button">Settings</Link></li>
        </ul>
      </nav>
      <div className="dashboard-content">
        <Outlet />
      </div>      
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;