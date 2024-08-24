import React, {useContext} from "react";
import {Admin} from "../pages";
import {ApiContext} from "../context/ApiContext";

const AdminWrapper = () => {
    const { rootUrl } = useContext(ApiContext);
    return <Admin rootURL={rootUrl} />;
};

export default AdminWrapper;