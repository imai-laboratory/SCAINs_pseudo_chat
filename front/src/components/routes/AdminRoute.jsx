import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children, user }) => {
    return user && user.role === 0 ? children : <Navigate to="/login" />;
};

export default AdminRoute;
