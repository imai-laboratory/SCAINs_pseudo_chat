import './assets/styles/App.css';
import React, { useState, useCallback, useEffect } from 'react';
import {Chats, UserStatements} from "./components/index";
import sampleData from "./assets/data/sample.js";

function App() {
    const [buttonVisible, setButtonVisible] = useState(true);
    const [chats, setChats] = useState([]);
    const [currentUserIndex, setCurrentUserStatement] = useState(0);
    const [dataset, setDataset] = useState([]);
    const [userStatement, setUserStatement] = useState();

    //データセットの指定
    useEffect(() => {
        setDataset(sampleData);
    }, []);

    // サンプルデータの初期値セット
    useEffect(() => {
        if (dataset.length > 0) {
            const initUserIndex = dataset.findIndex((data) => data.person === 'user');
            const initChats = dataset.slice(0, initUserIndex);
            setChats(initChats);
            setCurrentUserStatement(initUserIndex);
            setUserStatement(dataset[initUserIndex].content);
        }
    }, [dataset]);

    //chatを加えていく
    const addChats = useCallback((chat) => {
        setChats(prevChats => {
            return [...prevChats, chat]
        });
    }, [setChats]);

    const handleUserSendMessage = () => {
        const nextUserIndex = dataset.findIndex((data, index) =>
            index > currentUserIndex && data.person === 'user'
        );
        setButtonVisible(false);

        if (nextUserIndex !== -1) {
            // 次のユーザーのインデックスまでのチャットを取得
            const chats = dataset.slice(currentUserIndex, nextUserIndex);
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
            setUserStatement(dataset[nextUserIndex].content);
        } else {
            // データの最後まで表示
            const chats = dataset.slice(currentUserIndex);
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
