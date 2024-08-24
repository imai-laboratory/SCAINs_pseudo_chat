import React, { createContext, useState, useEffect, useContext } from 'react';
import { ApiContext } from './ApiContext';
import { SessionContext } from './SessionContext';
import { fetchUser } from '../utils/UserFetcher';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { rootUrl } = useContext(ApiContext);
    const { setSessionExpired } = useContext(SessionContext);

    useEffect(() => {
        if (rootUrl) {
            fetchUser(rootUrl, setUser, setLoading, setSessionExpired);
        }
    }, [rootUrl, setSessionExpired]);

    return (
        <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
