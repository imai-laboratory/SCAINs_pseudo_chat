import './assets/styles/App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, Result } from "./components";

function App() {
    const [isMissedListener, setIsMissedListener] = useState(false);

    const handleChangePerspective = () => {
        setIsMissedListener(!isMissedListener);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            isMissedListener={isMissedListener}
                        />
                    }
                />
                <Route
                    path="/result"
                    element={
                        <Result
                            handleChangePerspective={handleChangePerspective}
                            isMissedListener={isMissedListener}
                        />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
