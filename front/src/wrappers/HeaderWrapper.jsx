import React, { useContext } from 'react';
import { Header } from '../components';
import { UserContext } from '../context/UserContext';

const HeaderWrapper = () => {
    const { user, setUser } = useContext(UserContext);
    return <Header user={user} setUser={setUser} />;
};

export default HeaderWrapper;
