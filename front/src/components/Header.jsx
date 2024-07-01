import React from 'react';
import { Link } from 'react-router-dom';
import "../assets/styles/Header.css";
import header_logo from "../assets/images/header_logo.jpg"

function Header() {
    return (
        <header className="header">
            <Link to="/" className="logo">
                <img src={header_logo} alt="header-logo" className="header-logo"/>
            </Link>
        </header>
    );
}

export default Header;