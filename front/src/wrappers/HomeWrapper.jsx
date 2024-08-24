import {UserContext} from "../context/UserContext";
import {useContext, useState} from "react";
import {Home} from "../pages";
import {ApiContext} from "../context/ApiContext";

const HomeWrapper = () => {
    const { user } = useContext(UserContext);
    const { rootUrl } = useContext(ApiContext);
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