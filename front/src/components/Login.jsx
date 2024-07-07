import React, {useContext, useState} from 'react';
import axios from 'axios';
import {AuthForm} from "./";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../context/UserContext";

function Login() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { setUser, setLoading, rootUrl } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post(`${rootUrl}/login`, new URLSearchParams({
            name: username,
            email: email
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
            setError('ログインに失敗しました。ユーザー名またはメールアドレスが間違っています。');
          } else {
            setError('ログイン中にエラーが発生しました。もう一度お試しください。');
          }
        }
    };

    const handleFieldChange = (index, value) => {
        if (index === 0) setUsername(value);
        if (index === 1) setEmail(value);
    };


    return (
        <AuthForm
            btnText="ログイン"
            title="ログイン画面"
            fields={[
                { type: 'text', value: username, placeholder: 'ユーザ名' },
                { type: 'text', value: email, placeholder: 'Email' },
            ]}
            onSubmit={handleSubmit}
            error={error}
            onChange={handleFieldChange}
        />
    );
}

export default Login;
