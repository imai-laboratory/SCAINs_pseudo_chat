import './assets/styles/App.css';
import React, { useState, useCallback, useEffect } from 'react';
import sampleData from './assets/data/sample.js'
import {Chats, UserStatements} from "./components/index";

function App() {
    const [chats, setChats] = useState([]);
    const [userStatement, setUserStatement] = useState();
    const [currentUserIndex, setCurrentUserStatement] = useState(0);
    const [buttonVisible, setButtonVisible] = useState(true);


    // サンプルデータの初期値セット
    useEffect(() => {
        const initUserIndex = sampleData.findIndex((data) =>
            data.person === 'user'
        );
        const initChats = sampleData.slice(0, initUserIndex);
        setChats(initChats);
        setCurrentUserStatement(initUserIndex);
        setUserStatement(sampleData[initUserIndex].content);
    }, []);

    const addChats = useCallback((chat) => {
        setChats(prevChats => {
            return [...prevChats, chat]
        });
    }, [setChats]);

    const handleUserSendMessage = () => {
        const nextUserIndex = sampleData.findIndex((data, index) =>
            index > currentUserIndex && data.person === 'user'
        );
        setButtonVisible(false);

        if (nextUserIndex !== -1) {
            // 次のユーザーのインデックスまでのチャットを取得
            const chats = sampleData.slice(currentUserIndex, nextUserIndex);
            // チャットを1秒ごとに追加していく
            chats.forEach((chat, index) => {
                setTimeout(() => {
                    addChats(chat);
                    if (index === chats.length - 1) {
                        setButtonVisible(true);
                    }
                }, index * 1000);
            });
            setCurrentUserStatement(nextUserIndex);
            setUserStatement(sampleData[nextUserIndex].content);
        } else {
            // データの最後まで表示
            const chats = sampleData.slice(currentUserIndex);
            chats.forEach((chat, index) => {
                setTimeout(() => {
                    addChats(chat);
                }, index * 1000);
            });
        }
    }

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
            <UserStatements buttonVisible={buttonVisible} handleUserSendMessage={handleUserSendMessage} userStatement={userStatement} />
        </div>
    </section>
    );
}

export default App;
