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
    const [displayChats, setDisplayChats] = useState([]);
    const [llmUrl, setLlmUrl] = useState('');
    const [omittedChats, setOmittedChats] = useState([]);
    const [scains, setScains] = useState([]);
    const [userStatement, setUserStatement] = useState('');
    const [isFreeChatMode, setIsFreeChatMode] = useState(false);
    const [isMissedListener, setIsMissedListener] = useState(false);
    const [isScainsMode, setIsScainsMode] = useState(false);

    const omittedChatsRef = useRef(omittedChats);

    useEffect(() => {
        setAgent('B');
        setDataset(sampleData);
        setLlmUrl('http://localhost:8000/api/generate-response');
    }, []);

    // サンプルデータの初期値セット
    useEffect(() => {
        if (dataset.length > 0) {
            const datasetCopy = JSON.parse(JSON.stringify(dataset));
            const initUserIndex = dataset.findIndex((data) => data.person === 'user');
            const initChats = dataset.slice(0, initUserIndex);
            const initScains = dataset.slice(dataset.length - 5, dataset.length - 3);
            const part1 = datasetCopy.slice(0, 2);
            const missing = datasetCopy.slice(2, datasetCopy.length - 3);
            missing.forEach(data => {
                data.content = '×'.repeat(data.content.length);
            });
            const part2 = datasetCopy.slice(datasetCopy.length - 3, datasetCopy.length);
            const initOmittedChats = part1.concat(missing).concat(part2);
            setScains(initScains);
            setChats(initChats);
            setOmittedChats(initOmittedChats);
            setCurrentUserStatement(initUserIndex);
            setUserStatement(dataset[initUserIndex].content);
        }
    }, [dataset]);

    useEffect(() => {
        omittedChatsRef.current = omittedChats;
    }, [omittedChats]);

    const addChats = useCallback((chat) => {
        setChats(prevChats => {
            return [...prevChats, chat];
        });
    }, []);

    const addChatsToOmitted = useCallback((chat) => {
        setOmittedChats(prevChats => {
            const newChats = [...prevChats, chat];
            omittedChatsRef.current = newChats;
            return newChats;
        });
    }, []);

    const handleUserSendMessage = async (inputValue) => {
        if (isFreeChatMode) {
            await addChats({ index: chats.length + 1, content: inputValue, person: 'user' });
            await addChatsToOmitted({ index: chats.length + 1, content: inputValue, person: 'user' });
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
            conversation: omittedChatsRef.current,
            agent: agent
        };
        console.log(payload);
        try {
            const response = await axios.post(llmUrl, payload);
            addChats({ index: chats.length + 2, person: agent, content: response.data.response });
            addChatsToOmitted({ index: chats.length + 2, person: agent, content: response.data.response });
        } catch (error) {
            console.error('Error with ChatGPT API:', error);
            console.error('Error details:', error.response ? error.response.data : error.message);
            addChats({ index: chats.length + 2, person: agent, content: '申し訳ありません。現在応答できません。' });
            addChatsToOmitted({ index: chats.length + 2, person: agent, content: '申し訳ありません。現在応答できません。' });
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

    const handleChangeMode = () => {
        setIsScainsMode(!isScainsMode);
    };

    const handleChangePerspective = () => {
        setIsMissedListener(!isMissedListener);
    };

    useEffect(() => {
        if (isMissedListener) {
            setButtonVisible(false);
            const newOmittedChats = omittedChats.slice(0, chats.length);
            setDisplayChats(newOmittedChats);
        } else {
            setButtonVisible(true);
            setDisplayChats(chats);
        }
    }, [isMissedListener, chats, omittedChats]);

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
                    chats={displayChats}
                    isScainsMode={isScainsMode}
                    scains={scains}
                />
                <UserStatements
                    buttonVisible={buttonVisible}
                    handleUserSendMessage={handleUserSendMessage}
                    isFreeChatMode={isFreeChatMode}
                    userStatement={userStatement}
                />
            </div>
            <button onClick={handleReset}>リセット</button>
            <button onClick={handleChangeMode}>
                {isScainsMode ? 'SCAINsを非表示にする' : 'SCAINsを表示する'}
            </button>
            <button onClick={handleChangePerspective}>
                {isMissedListener ? 'user視点に戻す' : 'Bさんの視点に切り替える'}
            </button>
        </section>
    );
}

export default App;
