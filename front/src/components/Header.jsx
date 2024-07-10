import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../assets/styles/Header.css";
import header_logo from "../assets/images/header_logo.jpg"
import {IconButton, Menu, MenuItem} from '@mui/material';
import {AccountCircle} from "@mui/icons-material";

function Header({ user, setUser }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

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
        localStorage.removeItem('token'); // トークンを削除
        localStorage.removeItem('user'); // ユーザー情報を削除
        setUser(null); // 状態を更新してユーザー情報を削除
        navigate('/login'); // ログインページにリダイレクト
    };


    return (
        <header className="header">
            <Link to="/" className="logo">
                <img src={header_logo} alt="header-logo" className="header-logo"/>
            </Link>
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
                        <AccountCircle sx={{ fontSize: 36 }} />
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
                        { user.role === 0 && (
                            <MenuItem onClick={handleAdmin}>管理画面</MenuItem>
                        )}
                        <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
                    </Menu>
                </div>
            )}
        </header>
    );
}

export default Header;
