import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rootUrl, setRootUrl] = useState('');

    useEffect(() => {
        setLoading(true);
        const localUrl = process.env.REACT_APP_LOCAL_URL;
        const prodUrl = process.env.REACT_APP_PROD_URL;
        const storedUser = localStorage.getItem('user');

        setRootUrl(process.env.NODE_ENV === 'development' ? localUrl : prodUrl);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, setLoading, rootUrl }}>
            {children}
        </UserContext.Provider>
    );
};
