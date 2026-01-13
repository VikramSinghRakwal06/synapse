import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute'; 

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes (Only accessible if logged in) */}
      <Route element={<ProtectedRoute />}>
        {/* This is the nested route. If you go to '/', you see Dashboard */}
        <Route path="/" element={<Dashboard />} />
      </Route>

      {/* Catch-all: Redirect unknown URLs to Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;