import { Link } from 'react-router-dom';
import '../assets/styles/SessionExpired.css';

const SessionExpired = ({ setSessionExpired }) => {

    return (
        <div className="container">
            <h1>セッションタイムアウト</h1>
            <p>セッションがタイムアウトしました。再度ログインしてください。</p>
            <Link to="/login" onClick={() => setSessionExpired(false)}>ログインページへ</Link>
        </div>
    );
};

export default SessionExpired;
