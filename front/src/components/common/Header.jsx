import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../../assets/styles/Header.css";
import header_logo from "../../assets/images/header_logo.jpg"
import {IconButton, Menu, MenuItem} from '@mui/material';
import {AccountCircle} from "@mui/icons-material";
import { useTranslation } from 'react-i18next'
import Button from "@mui/material/Button";

function Header({ user, setUser }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [langAnchorEl, setLangAnchorEl] = useState(null);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAdmin = () => {
        handleClose();
        navigate('/admin');
    };

    const handleLogout = () => {
        handleClose();
        localStorage.removeItem('isFirstLogin');
        localStorage.removeItem('token'); // トークンを削除
        localStorage.removeItem('user'); // ユーザー情報を削除
        setUser(null); // 状態を更新してユーザー情報を削除
        navigate('/login'); // ログインページにリダイレクト
    };

    const handleLangMenu = (event) => {
        setLangAnchorEl(event.currentTarget);
    };

    const handleLangChange = (lang) => {
        i18n.changeLanguage(lang).then(() => {
            setLangAnchorEl(null);
            window.location.reload();
        });
    };

    const handleLangClose = () => {
        setLangAnchorEl(null);
    };

    return (
        <header className="header">
            <Link to="/" className="logo">
                <img src={header_logo} alt="header-logo" className="header-logo"/>
            </Link>
            <div className="right-items">
                <div className="language-and-account">
                    <Button onClick={handleLangMenu}>
                        {t('language')}
                    </Button>
                    <Menu
                        anchorEl={langAnchorEl}
                        open={Boolean(langAnchorEl)}
                        onClose={handleLangClose}
                    >
                        <MenuItem onClick={() => handleLangChange('en')}>🇺🇸 English</MenuItem>
                        <MenuItem onClick={() => handleLangChange('ja')}>🇯🇵 日本語</MenuItem>
                    </Menu>

                    {user && (
                        <div className="account">
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle sx={{fontSize: 36}}/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                {user.role === 0 && (
                                    <MenuItem onClick={handleAdmin}>{t('menus.admin')}</MenuItem>
                                )}
                                <MenuItem onClick={handleLogout}>{t('menus.logout')}</MenuItem>
                            </Menu>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
