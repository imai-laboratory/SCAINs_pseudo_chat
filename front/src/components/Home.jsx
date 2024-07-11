import React, {useState, useCallback, useEffect, useRef} from 'react';
import {Chats, Monitor, UserStatements} from "./";
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

function Home({ isMissedListener, rootURL }) {
    const [agent, setAgent] = useState('');
    const [coreIndex, setCoreIndex] = useState(0);
    const [conversationList, setConversationList] = useState([]);
    const [chats, setChats] = useState([]);
    const [currentUserIndex, setCurrentUserStatement] = useState(0);
    const [dataset, setDataset] = useState([]);
    const [datasetList, setDatasetList] = useState([]);
    const [displayChats, setDisplayChats] = useState([]);
    const [history1, setHistory1] = useState([]);
    const [history2, setHistory2] = useState([]);
    const [llmUrl, setLlmUrl] = useState('');
    const [omittedChats, setOmittedChats] = useState([]);
    const [options, setOptions] = useState([]);
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
        setAgent('B');
        setDataset(initData);
        const datasets = files.map(file => file.default);
        setDatasetList(datasets);
        setTurn(1);
        setLlmUrl(`${rootURL}/api/generate-response`);
        axios.post(`${rootURL}/conversation/create`, { fileNames })
            .catch(error => console.error('Error:', error));
        axios.get(`${rootURL}/conversation/list`)
            .then(response => {
                setConversationList(response.data)
                setOptions(response.data.map(conversation => ({ value: conversation.id, label: conversation.name })));
            })
            .catch(error => console.error('Error:', error));
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
            await addChats({ index: chats.length + 1, content: inputValue, person: 'user' });
            await addChatsToOmitted({ index: chats.length + 1, content: inputValue, person: 'user' });
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

    const handleFreeChat = async () => {
        setShowSubmitButton(false);
        const payload = {
            conversation: cutMissing(omittedChatsRef.current),
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
        setShowSubmitButton(true);
        setUserStatement('');
    };

    const cutMissing = (conv) => {
        const part1 = conv.slice(0, 4);
        const part2 = conv.slice(coreIndex - 1, conv.length);
        return part1.concat(part2);
    };

    useEffect(() => {
        console.log(history1, conversationList);

    }, [history1, turn]);

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

    const handleDatasetChange = (selectedOption) => {
        setDataset(datasetList[selectedOption.value - 1]);
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
