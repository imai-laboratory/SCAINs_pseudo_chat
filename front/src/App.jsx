import './assets/styles/App.css';
import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import {
    AdminRouteWrapper,
    AdminWrapper,
    HeaderWrapper,
    LoginWrapper,
    MainWrapper,
    PrivateRouteWrapper, ResultWrapper
} from './wrappers';

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
                            {/*<HomeWrapper />*/}
                            <MainWrapper />
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

export default App;
