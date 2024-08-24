import React, { createContext, useState, useEffect } from 'react';

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
    const [rootUrl, setRootUrl] = useState('');

    useEffect(() => {
        const localUrl = process.env.REACT_APP_LOCAL_URL;
        const prodUrl = process.env.REACT_APP_PROD_URL;

        const currentUrl = process.env.NODE_ENV === 'development' ? localUrl : prodUrl;
        setRootUrl(currentUrl);
    }, []);

    return (
        <ApiContext.Provider value={{ rootUrl }}>
            {children}
        </ApiContext.Provider>
    );
};

export default ApiProvider;
