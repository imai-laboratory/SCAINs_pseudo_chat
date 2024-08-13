import React, { useContext } from 'react';
import { PrivateRoute, Loading } from '../components';
import { UserContext } from '../context/UserContext';
import {SessionExpired} from "../pages";

const PrivateRouteWrapper = ({ children }) => {
    const { user, loading, sessionExpired, setSessionExpired } = useContext(UserContext);
    if (loading) {
        return <Loading />;
    }
    if (sessionExpired) {
        return <SessionExpired setSessionExpired={setSessionExpired} />;
    }
    return <PrivateRoute user={user}>{children}</PrivateRoute>;
};

export default PrivateRouteWrapper;
