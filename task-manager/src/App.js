import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './elements/Login';
import Register from './elements/Register';
import Dashboard from './elements/Dashboard';
import ProtectedRoute from './elements/ProtectedRoute';
import Tasks from './elements/Tasks';
import Categories from './elements/Categories';
import Settings from './elements/UserSettings';
import './style/Style.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path="tasks" element={<Tasks />} />
            <Route path="categories" element={<Categories />} />
            <Route path="settings" element={<Settings />} /></Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;