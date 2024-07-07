import './assets/styles/App.css';
import React, {useEffect, useState} from 'react';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import {Admin, AdminRoute, Header, Home, Login, PrivateRoute, Result} from "./components";

function App() {
    const [isMissedListener, setIsMissedListener] = useState(false);
    const [rootUrl, setrootUrl] = useState('');

    useEffect(() => {
        const localUrl = process.env.REACT_APP_LOCAL_URL;
        const prodUrl = process.env.REACT_APP_PROD_URL;
        setrootUrl(process.env.NODE_ENV === 'development' ? localUrl : prodUrl);
    }, [rootUrl]);

    const handleChangePerspective = () => {
        setIsMissedListener(!isMissedListener);
    };

    return (
        <Router>
            <Header/>
            <Routes>
                <Route path="/login" element={<Login rootURL={rootUrl} />} />
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <Admin rootURL={rootUrl} />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Home
                                isMissedListener={isMissedListener}
                                rootURL={rootUrl}
                            />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/result"
                    element={
                        <PrivateRoute>
                            <Result
                                handleChangePerspective={handleChangePerspective}
                                isMissedListener={isMissedListener}
                                setIsMissedListener={setIsMissedListener}
                            />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
