import React, { useContext } from 'react';
import {AdminRoute, Loading} from '../components';
import { UserContext } from '../context/UserContext';
import {SessionExpired} from "../pages";
import {SessionContext} from "../context/SessionContext";

const AdminRouteWrapper = ({ children }) => {
    const { user, loading } = useContext(UserContext);
    const { sessionExpired, setSessionExpired } = useContext(SessionContext);
    if (loading) {
        return <Loading />;
    }
    if (sessionExpired) {
        return <SessionExpired setSessionExpired={setSessionExpired}/>;
    }
    return <AdminRoute user={user}>{children}</AdminRoute>;
};

export default AdminRouteWrapper;
