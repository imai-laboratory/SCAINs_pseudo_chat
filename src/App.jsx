import './assets/styles/App.css';
import React, { useState, useEffect } from 'react';
import sampleData from './assets/data/sample.js'
import {Chats, UserStatements} from "./components/index";

function App() {
    const [chats, setChats] = useState([]);
    const [userStatement, setUserStatements] = useState();

    // サンプルデータのセット
    useEffect(() => {
        const userData = sampleData.filter(item => item.person === "user");
        setChats(sampleData);
        setUserStatements(userData[0].content);
    }, []);

    // スクロール位置の設定
    useEffect(() => {
        const scrollArea = document.getElementById('scroll-area');
        if (scrollArea) {
            scrollArea.scrollTop = scrollArea.scrollHeight;
        }
    });

    return (
    <section className="app-container">
        <div className="chat-box-container">
            <Chats chats={chats}/>
            <UserStatements userStatement={userStatement} />
        </div>
    </section>
    );
}

export default App;
