import React, {useState} from "react";
import {Result} from "../pages";

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

export default ResultWrapper;