import {UserContext} from "../context/UserContext";
import {useContext, useState} from "react";
import {Home} from "../pages";

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

export default HomeWrapper;