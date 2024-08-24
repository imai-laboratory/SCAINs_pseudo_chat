import React, { useState, useContext } from 'react';
import {Main} from "../pages";
import {ApiContext} from "../context/ApiContext";
import {UserContext} from "../context/UserContext";

const MainWrapper = () => {
    const { rootUrl } = useContext(ApiContext);
    const { user } = useContext(UserContext);
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
