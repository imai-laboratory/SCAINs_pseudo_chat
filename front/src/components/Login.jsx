import React, {useState} from 'react';
import axios from 'axios';
import {AuthForm} from "./";
import {useNavigate} from "react-router-dom";

function Login({ setUser, setLoading, rootURL }) {
    const [loginId, setLoginId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post(`${rootURL}/login`, new URLSearchParams({
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
            setError('ログインに失敗しました。ログインIDが間違っています。');
          } else {
            setError('ログイン中にエラーが発生しました。もう一度お試しください。');
          }
        }
    };

    const handleFieldChange = (index, value) => {
        if (index === 0) setLoginId(value);
    };


    return (
        <AuthForm
            btnText="ログイン"
            title="ログイン画面"
            fields={[
                { type: 'text', value: loginId, placeholder: 'ログインID' },
            ]}
            onSubmit={handleSubmit}
            error={error}
            onChange={handleFieldChange}
        />
    );
}

export default Login;
