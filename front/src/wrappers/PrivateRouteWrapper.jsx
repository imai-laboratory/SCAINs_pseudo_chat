import React, { useContext } from 'react';
import { PrivateRoute, Loading } from '../components';
import { UserContext } from '../context/UserContext';
import {SessionExpired} from "../pages";
import {SessionContext} from "../context/SessionContext";

const PrivateRouteWrapper = ({ children }) => {
    const { user, loading } = useContext(UserContext);
    const { sessionExpired, setSessionExpired } = useContext(SessionContext);
    if (loading) {
        return <Loading />;
    }
    if (sessionExpired) {
        return <SessionExpired setSessionExpired={setSessionExpired} />;
    }
    return <PrivateRoute user={user}>{children}</PrivateRoute>;
};

export default PrivateRouteWrapper;
