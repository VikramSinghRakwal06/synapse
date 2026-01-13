import React from 'react'
import useAuthStore from '../store/useAuthStore';
import Loader from '../components/Loader';
import { Outlet, Navigate } from 'react-router-dom';
const ProtectedRoute = () => {
    const {isAuthenticated, isLoading}= useAuthStore();
    if(isLoading)return <Loader/>;
    return isAuthenticated? <Outlet/> : <Navigate to="/login" replace/>;
}

export default ProtectedRoute;
