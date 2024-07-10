import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/SessionExpired.css';

const SessionExpired = () => {
  return (
    <div className="container">
      <h1>セッションタイムアウト</h1>
      <p>セッションがタイムアウトしました。再度ログインしてください。</p>
      <Link to="/login">ログインページへ</Link>
    </div>
  );
};

export default SessionExpired;
