import './assets/styles/App.css';
import React, {useContext, useState} from 'react';
import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import {Admin, AdminRoute, Header, Home, Loading, Login, PrivateRoute, Result, SessionExpired} from "./components";
import { UserContext } from './context/UserContext';

function App() {
    return (
        <Router>
            <HeaderWrapper />
            <Routes>
                <Route path="/login" element={<LoginWrapper />} />
                <Route
                    path="/admin"
                    element={
                        <AdminRouteWrapper>
                            <AdminWrapper />
                        </AdminRouteWrapper>
                    }
                />
                <Route
                    path="/"
                    element={
                        <PrivateRouteWrapper>
                            <HomeWrapper />
                        </PrivateRouteWrapper>
                    }
                />
                <Route
                    path="/result"
                    element={
                        <PrivateRouteWrapper>
                            <ResultWrapper />
                        </PrivateRouteWrapper>
                    }
                />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

const HeaderWrapper = () => {
    const { user, setUser } = useContext(UserContext);
    return <Header user={user} setUser={setUser} />;
};

const LoginWrapper = () => {
    const { rootUrl, setUser, setLoading, user } = useContext(UserContext);
    return <Login rootURL={rootUrl} setUser={setUser} setLoading={setLoading} user={user} />;
};

const AdminRouteWrapper = ({ children }) => {
    const { user, loading, sessionExpired, setSessionExpired } = useContext(UserContext);
    if (loading) {
        return <Loading />;
    }
    if (sessionExpired) {
        return <SessionExpired setSessionExpired={setSessionExpired}/>;
    }
    return <AdminRoute user={user}>{children}</AdminRoute>;
};

const PrivateRouteWrapper = ({ children }) => {
    const { user, loading, sessionExpired, setSessionExpired } = useContext(UserContext);
    if (loading) {
        return <Loading />;
    }
    if (sessionExpired) {
        return <SessionExpired setSessionExpired={setSessionExpired}/>;
    }
    return <PrivateRoute user={user}>{children}</PrivateRoute>;
};

const AdminWrapper = () => {
    const { rootUrl } = useContext(UserContext);
    return <Admin rootURL={rootUrl} />;
};

const HomeWrapper = () => {
    const { rootUrl, user } = useContext(UserContext);
    const [isMissedListener, setIsMissedListener] = useState(false);

    const handleChangePerspective = () => {
        setIsMissedListener(!isMissedListener);
    };

    return (
        <Home
            isMissedListener={isMissedListener}
            rootURL={rootUrl}
            user={user}
            handleChangePerspective={handleChangePerspective}
        />
    );
};

const ResultWrapper = () => {
    const [isMissedListener, setIsMissedListener] = useState(false);

    const handleChangePerspective = () => {
        setIsMissedListener(!isMissedListener);
    };

    return (
        <Result
            handleChangePerspective={handleChangePerspective}
            isMissedListener={isMissedListener}
            setIsMissedListener={setIsMissedListener}
        />
    );
};

export default App;
