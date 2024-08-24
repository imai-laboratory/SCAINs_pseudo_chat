import { Link } from 'react-router-dom';
import '../assets/styles/SessionExpired.css';
import {useTranslation} from "react-i18next";

const SessionExpired = ({ setSessionExpired }) => {
    const { t } = useTranslation();
    return (
        <div className="container">
            <h1>{t('sessionExpired.timeout')}</h1>
            <p>{t('sessionExpired.requireLogin')}</p>
            <Link to="/login" onClick={() => setSessionExpired(false)}>{t('sessionExpired.toLogin')}</Link>
        </div>
    );
};

export default SessionExpired;
