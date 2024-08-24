import React, { useState } from 'react';
import axios from 'axios';
import { AuthForm } from '../components';
import { useNavigate } from 'react-router-dom';
import {useTranslation} from "react-i18next";

function Login({ setUser, setLoading, rootURL, user }) {
    const { t } = useTranslation();
    const [loginId, setLoginId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${rootURL}/auth/login`, new URLSearchParams({
                login_id: loginId,
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setError('');
            setUser(response.data.user);
            setLoading(false);
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError(t("login.errors.invalid"));
            } else {
                setError(t("login.errors.server"));
            }
            setLoading(false);
        }
    };

    const handleFieldChange = (index, value) => {
        if (index === 0) setLoginId(value);
    };

    return (
        <AuthForm
            btnText={t('login.btnText')}
            title={t('login.title')}
            fields={[
                { type: 'text', value: loginId, placeholder: t("login.id") },
            ]}
            onSubmit={handleSubmit}
            error={error}
            onChange={handleFieldChange}
        />
    );
}

export default Login;
