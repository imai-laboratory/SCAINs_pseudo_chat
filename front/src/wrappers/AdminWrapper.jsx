import React, {useContext} from "react";
import {UserContext} from "../context/UserContext";
import {Admin} from "../pages";

const AdminWrapper = () => {
    const { rootUrl } = useContext(UserContext);
    return <Admin rootURL={rootUrl} />;
};

export default AdminWrapper;