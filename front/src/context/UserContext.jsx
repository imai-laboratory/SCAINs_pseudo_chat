import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rootUrl, setRootUrl] = useState('');
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        setLoading(true);
        setLoading(false);
        const localUrl = process.env.REACT_APP_LOCAL_URL;
        const prodUrl = process.env.REACT_APP_PROD_URL;
        const storedUser = localStorage.getItem('user');

        const currentUrl = process.env.NODE_ENV === 'development' ? localUrl : prodUrl;
        setRootUrl(currentUrl);

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            if (!rootUrl) {
                return;
            }
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }
            try {
                const response = await axios.get(`${rootUrl}/user/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error('ユーザー情報取得エラー:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setUser(null);
                setSessionExpired(true);
            } finally {
                setLoading(false);
            }
        };

        if (rootUrl) {
            fetchUser();
        }
    }, [rootUrl]);

    useEffect(() => {
        axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    console.log('セッションが期限切れになりました。');
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    setUser(null);
                    setSessionExpired(true);
                }
                return Promise.reject(error);
            }
        );
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, setLoading, rootUrl, sessionExpired }}>
            {children}
        </UserContext.Provider>
    );
};
