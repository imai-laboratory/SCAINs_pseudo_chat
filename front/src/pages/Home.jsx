import React, {useState, useCallback, useEffect, useRef} from 'react';
import {Chats, Monitor, UserStatements} from "../components";
import initData from "../assets/data/PP10";
import axios from 'axios';
import image_A from "../assets/images/A.jpg";
import image_B from "../assets/images/B.jpg";
import image_missing_B from "../assets/images/missing_B.jpg";
import image_user from "../assets/images/user.jpg";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
const context = require.context('../assets/data', false, /\.js$/);
const files = context.keys().map(context);
const fileNames = context.keys().map(file => {
    return file.replace('./', '').replace('.js', '');
});

function Home({ isMissedListener, rootURL, user }) {
    const [agent, setAgent] = useState('');
    const [coreIndex, setCoreIndex] = useState(0);
    const [chats, setChats] = useState([]);
    const [currentUserIndex, setCurrentUserStatement] = useState(0);
    const [dataset, setDataset] = useState([]);
    const [datasetList, setDatasetList] = useState([]);
    const [displayChats, setDisplayChats] = useState([]);
    const [history1, setHistory1] = useState([]);
    const [history2, setHistory2] = useState([]);
    const [omittedChats, setOmittedChats] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(1);
    const [scains, setScains] = useState([]);
    const [speaker, setSpeaker] = useState('');
    const [showSubmitButton, setShowSubmitButton] = useState(true);
    const [switchMissedImage, setSwitchMissedImage] = useState(false);
    const [turn, setTurn] = useState(0);
    const [userStatement, setUserStatement] = useState('');
    const [isCoreStatementSpoken, setIsCoreStatementSpoken] = useState(false);
    const [isFreeChatMode, setIsFreeChatMode] = useState(false);
    const [isScainsMode, setIsScainsMode] = useState(false);

    const navigate = useNavigate();
    const omittedChatsRef = useRef(omittedChats);

    //初期化
    const init = useCallback(() => {
        const initUserIndex = dataset.findIndex((data) => data.person === 'user');
        const initChats = dataset.slice(0, initUserIndex);
        setChats(initChats);
        setCurrentUserStatement(initUserIndex);
        setUserStatement(dataset[initUserIndex].content);
        setIsFreeChatMode(false);
        setSwitchMissedImage(false);
    }, [dataset, setChats, setCurrentUserStatement, setUserStatement, setIsFreeChatMode, setSwitchMissedImage]);

    useEffect(() => {
        const initialize = async () => {
            try {
                setAgent('B');
                setDataset(initData);
                const datasets = files.map(file => file.default);
                setDatasetList(datasets);
                setTurn(1);

                const isFirstLogin = localStorage.getItem('isFirstLogin');
                if (isFirstLogin === null) {
                    await axios.post(`${rootURL}/conversation/create`, { fileNames });
                    localStorage.setItem('isFirstLogin', 'false');
                }

                const response = await axios.get(`${rootURL}/conversation/list`);
                const option = response.data.map(conversation => ({ value: conversation.id, label: `対話文${conversation.id}`}));
                setOptions(option);
                setSelectedOption(option[0]);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        initialize();
    }, [rootURL]);


    // サンプルデータの初期値セット
    useEffect(() => {
        if (dataset.length > 0) {
            const datasetCopy = JSON.parse(JSON.stringify(dataset));
            const scainIndexes = datasetCopy.filter(item => item.role === "scain").map(item => item.index);
            const coreIndex = datasetCopy.find(item => item.role === "core").index;
            setCoreIndex(coreIndex);
            const initUserIndex = dataset.findIndex((data) => data.person === 'user');
            const initChats = dataset.slice(0, initUserIndex);
            const initScains = dataset.slice(scainIndexes[0] - 1, scainIndexes[1]);
            const part1 = datasetCopy.slice(0, 4);
            const missing = datasetCopy.slice(4, coreIndex - 1);
            missing.forEach(data => {
                data.content = '×'.repeat(data.content.length);
            });
            const part2 = datasetCopy.slice(coreIndex - 1, datasetCopy.length);
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
            await addChats({ index: chats.length + 1, content: inputValue, person: 'user', role: 'free' });
            await addChatsToOmitted({ index: chats.length + 1, content: inputValue, person: 'user', role: 'free' });
            setUserStatement(inputValue);
            await handleFreeChat(inputValue);
        } else {
            const nextUserIndex = dataset.findIndex((data, index) =>
                index > currentUserIndex && data.person === 'user'
            );
            setShowSubmitButton(false);

            if (nextUserIndex !== -1) {
                // 次のユーザーのインデックスまでのチャットを取得
                const partial_chats = dataset.slice(currentUserIndex, nextUserIndex);
                // チャットを1秒ごとに追加していく
                partial_chats.forEach((chat, index) => {
                    setShowSubmitButton(false);
                    setTimeout(() => {
                        addChats(chat);
                        if (index === partial_chats.length - 1) {
                            setShowSubmitButton(true);
                        }
                    }, index * 2500);
                });
                setCurrentUserStatement(nextUserIndex);
                setUserStatement(dataset[nextUserIndex].content);
            } else {
                // データの最後まで表示
                const partial_chats = dataset.slice(currentUserIndex);
                if (currentUserIndex === coreIndex - 1) {
                    setIsCoreStatementSpoken(true);
                }
                partial_chats.forEach((chat, index) => {
                    setShowSubmitButton(false);
                    setTimeout(() => {
                        addChats(chat);
                        if (index === partial_chats.length - 1) {
                            setIsFreeChatMode(true);
                            setShowSubmitButton(true);
                            setCurrentUserStatement(dataset.length);
                            setSwitchMissedImage(true);
                        }
                    }, index * 2000);
                });
            }
        }
    };

    const pollResult = async (taskId) => {
        try {
            const result = await axios.get(`${rootURL}/api/generate-response/result/${taskId}`);
            if (result && result.data) {
                if (result.data.state === 'PENDING' || result.data.state === 'RETRY') {
                    setTimeout(() => pollResult(taskId), 2000); // 2秒後に再度リクエスト
                } else if (result.data.result) {
                    addChats({ index: chats.length + 2, person: agent, content: result.data.result, role: 'free' });
                    addChatsToOmitted({ index: chats.length + 2, person: agent, content: result.data.result, role: 'free' });
                } else {
                    addChats({ index: chats.length + 2, person: agent, content: '申し訳ありません。現在応答できません。', role: 'error' });
                    addChatsToOmitted({ index: chats.length + 2, person: agent, content: '申し訳ありません。現在応答できません。', role: 'error' });
                }
            } else {
                throw new Error('Result or result.data is null or undefined');
            }
        } catch (error) {
            addChats({ index: chats.length + 2, person: agent, content: '申し訳ありません。現在応答できません。', role: 'error' });
            addChatsToOmitted({ index: chats.length + 2, person: agent, content: '申し訳ありません。現在応答できません。', role: 'error' });
        }
    };

    const handleFreeChat = async () => {
        setShowSubmitButton(false);
        const payload = {
            conversation: cutMissing(omittedChatsRef.current),
            agent: agent
        };
        try {
            const response = await axios.post(`${rootURL}/api/generate-response`, payload);
            const taskId = response.data.task_id;
            await pollResult(taskId);
        } catch (error) {
            console.error('Error with ChatGPT API:', error);
            console.error('Error details:', error.response ? error.response.data : error.message);
            addChats({ index: chats.length + 2, person: agent, content: '申し訳ありません。現在応答できません。', role: 'error' });
            addChatsToOmitted({ index: chats.length + 2, person: agent, content: '申し訳ありません。現在応答できません。', role: 'error' });
        }
        setShowSubmitButton(true);
        setUserStatement('');
    };

    const cutMissing = (conv) => {
        const part1 = conv.slice(0, 4);
        const part2 = conv.slice(coreIndex - 1, conv.length);
        return part1.concat(part2);
    };

    useEffect(() => {
        if (turn === 3 && history1 && history2) {
            const chatMessageHistories = [
                {
                    conversation_id: selectedOption.value,
                    user_id: user.id,
                    message_number: 1,
                    content: history1,
                },
                {
                    conversation_id: selectedOption.value,
                    user_id: user.id,
                    message_number: 2,
                    content: history2,
                }
            ];
            axios.post(`${rootURL}/chat-message-history/batch-create`, chatMessageHistories)
                .catch(error => console.error('Error:', error));
        }
    }, [history1, history2, rootURL, selectedOption, turn, user.id]);

    useEffect(() => {
        if (turn === 3 && history2 !== null) {
            init();
            setIsCoreStatementSpoken(true);
            navigate('/result', {
                state: {
                    agent,
                    history1,
                    history2,
                    omittedChats,
                    scains,
                    speaker,
                }
            });
        }
    }, [agent, history1, history2, init, navigate, omittedChats, scains, speaker, turn]);

    const handleEndTurn = () => {
        if (turn === 1) {
            setTurn(turn + 1);
            setHistory1(chats);
            setIsScainsMode(true);
            setIsCoreStatementSpoken(false);
            init();
        } else if (turn === 2) {
            setTurn(turn + 1);
            setHistory2(chats);
        }
    };

    useEffect(() => {
        if (isMissedListener) {
            setShowSubmitButton(false);
            const newOmittedChats = omittedChats.slice(0, chats.length);
            setDisplayChats(newOmittedChats);
        } else {
            setDisplayChats(chats);
        }
    }, [isMissedListener, chats, omittedChats]);

    // スクロール位置の設定
    useEffect(() => {
        const scrollArea = document.getElementById('scroll-area');
        if (scrollArea) {
            scrollArea.scrollTop = scrollArea.scrollHeight;
        }
    }, [speaker]);

    const handleDatasetChange = (op) => {
        setDataset(datasetList[op.value - 1]);
        setSelectedOption(op);
        init();
    };

    return (
        <section className="app-container">
            <div className="explanation-container">
                <div className="xl text-bold step-text">
                    {turn === 1 ? `手順${turn}：システム支援（SCAINs表示）なし` : `手順${turn}：システム支援（SCAINs表示）あり`}
                </div>
                { turn === 1 && (
                    <Select
                        options={options}
                        placeholder="対話文を変更できます"
                        isDisabled={!showSubmitButton}
                        onChange={handleDatasetChange}
                    />
                )}
                <div className="next-btn">
                    <Button
                        variant="contained"
                        color="error"
                        size="large"
                        disabled={!showSubmitButton}
                        onClick={handleEndTurn}
                    >
                        {turn === 1 ? `手順${turn + 1}に進む` : `手順${turn}を終了し、対話履歴を表示`}
                    </Button>
                </div>
            </div>
            <div className="content">
                <div className="monitor-container">
                    <Monitor
                        image_A={image_A}
                        image_B={image_B}
                        image_user={image_user}
                        image_missing_B={image_missing_B}
                        isMissedListener={isMissedListener}
                        speaker={speaker}
                        switchMissedImage={switchMissedImage}
                    />
                </div>
                <div className="chats-content">
                    <div className="chat-box-container">
                        <Chats
                            agent={agent}
                            chats={displayChats}
                            isCoreStatementSpoken={isCoreStatementSpoken}
                            isMissedListener={isMissedListener}
                            isScainsMode={isScainsMode}
                            onSpeakerChange={setSpeaker}
                            scains={scains}
                        />
                        <UserStatements
                            buttonVisible={showSubmitButton}
                            handleUserSendMessage={handleUserSendMessage}
                            isFreeChatMode={isFreeChatMode}
                            userStatement={userStatement}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Home;
