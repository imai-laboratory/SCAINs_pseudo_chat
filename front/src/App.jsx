import './assets/styles/App.css';
import React, {useContext, useState} from 'react';
import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import {Admin, AdminRoute, Header, Home, Login, PrivateRoute, Result} from "./components";
import { UserProvider, UserContext } from './context/UserContext';

function App() {
    return (
        <UserProvider>
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
        </UserProvider>
    );
}

const HeaderWrapper = () => {
    const { user, setUser } = useContext(UserContext);
    return <Header user={user} setUser={setUser} />;
};

const LoginWrapper = () => {
    const { rootUrl, setUser, setLoading } = useContext(UserContext);
    return <Login rootURL={rootUrl} setUser={setUser} setLoading={setLoading} />;
};

const AdminRouteWrapper = ({ children }) => {
    const { user, loading } = useContext(UserContext);
    if (loading) {
        return <div>Loading...</div>;
    }
    return <AdminRoute user={user}>{children}</AdminRoute>;
};

const PrivateRouteWrapper = ({ children }) => {
    const { user, loading } = useContext(UserContext);
    if (loading) {
        return <div>Loading...</div>;
    }
    return <PrivateRoute user={user}>{children}</PrivateRoute>;
};

const AdminWrapper = () => {
    const { rootUrl } = useContext(UserContext);
    return <Admin rootURL={rootUrl} />;
};

const HomeWrapper = () => {
    const { rootUrl } = useContext(UserContext);
    const [isMissedListener, setIsMissedListener] = useState(false);

    const handleChangePerspective = () => {
        setIsMissedListener(!isMissedListener);
    };

    return (
        <Home
            isMissedListener={isMissedListener}
            rootURL={rootUrl}
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
