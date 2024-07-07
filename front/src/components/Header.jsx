import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../assets/styles/Header.css";
import header_logo from "../assets/images/header_logo.jpg"
import { Button, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomButton = styled(Button)({
    backgroundColor: '#ffffff', // 背景色の設定
    color: 'rgba(27,159,241,0.76)', // テキストの色
    textTransform: 'none', // テキストを小文字にする
    '&:hover': {
        backgroundColor: '#c8e2e4', // ホバー時の背景色
    },
});

function Header({ user, setUser}) {
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
                    <CustomButton
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        variant="contained"
                    >
                        <span className="lg text-bold">{user.name}さん</span>
                    </CustomButton>
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
