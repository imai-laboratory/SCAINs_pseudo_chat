import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import {Main} from "../pages";

const MainWrapper = () => {
    const { rootUrl, user } = useContext(UserContext);
    const [isMissedListener, setIsMissedListener] = useState(false);

    const handleChangePerspective = () => {
        setIsMissedListener(!isMissedListener);
    };

    return (
        <Main
            isMissedListener={isMissedListener}
            rootURL={rootUrl}
            user={user}
            handleChangePerspective={handleChangePerspective}
        />
    );
};

export default MainWrapper;
