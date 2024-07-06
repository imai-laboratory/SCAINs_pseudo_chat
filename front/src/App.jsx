import './assets/styles/App.css';
import React, {useEffect, useState} from 'react';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Header, Home, Login, Result } from "./components";
import sampleData from "./assets/data/PP10";

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
                    path="/"
                    element={
                        <Home
                            isMissedListener={isMissedListener}
                            rootURL={rootUrl}
                        />
                    }
                />
                <Route
                    path="/result"
                    element={
                        <Result
                            handleChangePerspective={handleChangePerspective}
                            isMissedListener={isMissedListener}
                            setIsMissedListener={setIsMissedListener}
                        />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
