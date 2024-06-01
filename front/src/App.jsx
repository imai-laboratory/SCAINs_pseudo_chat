import './assets/styles/App.css';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Chats, UserStatements } from "./components";
import sampleData from "./assets/data/PP10.js";
import axios from 'axios';

function App() {
    const [agent, setAgent] = useState('');
    const [buttonVisible, setButtonVisible] = useState(true);
    const [chats, setChats] = useState([]);
    const [currentUserIndex, setCurrentUserStatement] = useState(0);
    const [dataset, setDataset] = useState([]);
    const [llmUrl, setLlmUrl] = useState('');
    const [userStatement, setUserStatement] = useState('');
    const [isFreeChatMode, setIsFreeChatMode] = useState(false);

    const chatsRef = useRef(chats);

    useEffect(() => {
        setAgent('B');
        setDataset(sampleData);
        setLlmUrl('http://localhost:8000/api/generate-response');
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

    useEffect(() => {
        chatsRef.current = chats;
    }, [chats]);

    const addChats = useCallback((chat) => {
        setChats(prevChats => {
            const newChats = [...prevChats, chat];
            chatsRef.current = newChats;
            return newChats;
        });
    }, []);

    const handleUserSendMessage = async (inputValue) => {
        if (isFreeChatMode) {
            await addChats({ index: chats.length + 1, content: inputValue, person: 'user' });
            setUserStatement(inputValue);
            await handleFreeChat(inputValue);
        } else {
            const nextUserIndex = dataset.findIndex((data, index) =>
                index > currentUserIndex && data.person === 'user'
            );
            setButtonVisible(false);

            if (nextUserIndex !== -1) {
                // 次のユーザーのインデックスまでのチャットを取得
                const partial_chats = dataset.slice(currentUserIndex, nextUserIndex);
                // チャットを1秒ごとに追加していく
                partial_chats.forEach((chat, index) => {
                    setButtonVisible(false);
                    setTimeout(() => {
                        addChats(chat);
                        if (index === partial_chats.length - 1) {
                            setButtonVisible(true);
                        }
                    }, index * 1000);
                });
                setCurrentUserStatement(nextUserIndex);
                setUserStatement(dataset[nextUserIndex].content);
            } else {
                // データの最後まで表示
                const partial_chats = dataset.slice(currentUserIndex);
                partial_chats.forEach((chat, index) => {
                    setButtonVisible(false);
                    setTimeout(() => {
                        addChats(chat);
                        if (index === partial_chats.length - 1) {
                            setIsFreeChatMode(true);
                            setButtonVisible(true);
                            setCurrentUserStatement(dataset.length);
                        }
                    }, index * 1000);
                });
            }
        }
    };

    const handleFreeChat = async () => {
        setButtonVisible(false);
        const payload = {
            conversation: chatsRef.current,
            agent: agent
        };

        try {
            const response = await axios.post(llmUrl, payload);
            addChats({ person: agent, content: response.data.response });
        } catch (error) {
            console.error('Error with ChatGPT API:', error);
            console.error('Error details:', error.response ? error.response.data : error.message);
            addChats({ person: agent, content: '申し訳ありません。現在応答できません。' });
        }

        setButtonVisible(true);
        setUserStatement('');
    };

    const handleReset = () => {
        const initUserIndex = dataset.findIndex((data) => data.person === 'user');
        const initChats = dataset.slice(0, initUserIndex);
        setChats(initChats);
        setCurrentUserStatement(initUserIndex);
        setUserStatement(dataset[initUserIndex].content);
        setButtonVisible(true);
        setIsFreeChatMode(false);
    };

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
                <Chats
                    chats={chats}
                    isFreeChatMode={isFreeChatMode}
                    userStatement={userStatement}
                />
                <UserStatements
                    buttonVisible={buttonVisible}
                    handleUserSendMessage={handleUserSendMessage}
                    isFreeChatMode={isFreeChatMode}
                    userStatement={userStatement}
                />
            </div>
            <button onClick={handleReset}>リセット</button>
        </section>
    );
}

export default App;
