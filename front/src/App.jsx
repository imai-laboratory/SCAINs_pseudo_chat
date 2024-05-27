import './assets/styles/App.css';
import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Admin, Chats, UserStatements } from "./components";
import sampleData from "./assets/data/PP2.js";
// import axios from 'axios';

function App() {
    const [buttonVisible, setButtonVisible] = useState(true);
    const [chats, setChats] = useState([]);
    const [currentUserIndex, setCurrentUserStatement] = useState(0);
    const [dataset, setDataset] = useState([]);
    const [userStatement, setUserStatement] = useState();
    const [isFreeChatMode, setIsFreeChatMode] = useState(false);

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
            return [...prevChats, chat];
        });
    }, []);

    const handleUserSendMessage = async (inputValue) => {
        if (isFreeChatMode) {
            addChats({ index: chats.length + 1, content: inputValue, person: 'user' });
            setUserStatement(inputValue);
            // await handleFreeChat(userStatement);
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

    // const handleFreeChat = async (userInput) => {
    //     addChats({ person: 'user', content: userInput });
    //     setButtonVisible(false);
    //
    //     try {
    //         const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
    //             prompt: userInput,
    //             max_tokens: 200,
    //             temperature: 0,
    //         }, {
    //             headers: {
    //                 'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
    //             }
    //         });
    //
    //         const botResponse = response.data.choices[0].text.trim();
    //         addChats({ person: 'bot', content: botResponse });
    //     } catch (error) {
    //         console.error('Error with ChatGPT API:', error);
    //         addChats({ person: 'bot', content: '申し訳ありません。現在応答できません。' });
    //     }
    //
    //     setButtonVisible(true);
    //     setUserStatement('');
    // };

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
        <Router>
            <Routes>
                <Route path="/admin" element={<Admin />} />
                <Route path="/" element={
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
                } />
            </Routes>
        </Router>
    );
}

export default App;
