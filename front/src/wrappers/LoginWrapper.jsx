import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import {Login} from "../pages";

const LoginWrapper = () => {
    const { rootUrl, setUser, setLoading, user } = useContext(UserContext);
    return <Login rootURL={rootUrl} setUser={setUser} setLoading={setLoading} user={user} />;
};

export default LoginWrapper;
