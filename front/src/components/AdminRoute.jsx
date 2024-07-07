import React, {useContext} from 'react';
import { Navigate } from 'react-router-dom';
import {UserContext} from "../context/UserContext";

const AdminRoute = ({ children }) => {
    const { user } = useContext(UserContext);
    return user && user.role === 0 ? children : <Navigate to="/login" />;
};

export default AdminRoute;
