import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Login } from "../pages";
import {ApiContext} from "../context/ApiContext";

const LoginWrapper = () => {
    const { setUser, setLoading, user } = useContext(UserContext);
    const { rootUrl } = useContext(ApiContext);
    return <Login rootURL={rootUrl} setUser={setUser} setLoading={setLoading} user={user} />;
};

export default LoginWrapper;
