import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    console.log('セッションが期限切れになりました。');
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    setSessionExpired(true);
                }
                return Promise.reject(error);
            }
        );
    }, []);

    return (
        <SessionContext.Provider value={{ sessionExpired, setSessionExpired }}>
            {children}
        </SessionContext.Provider>
    );
};

export default SessionProvider;
