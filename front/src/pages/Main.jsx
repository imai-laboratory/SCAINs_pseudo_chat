import React, {useEffect, useRef, useState} from 'react';
import {Chats, SharedMonitor, UserStatements} from "../components";
import {checkScains} from "../api/checkScains";
import {generateImageTask} from "../api/imageTask";
import {pollResult} from "../utils/pollResult";
import image_A from "../assets/images/A.jpg";
import image_B from "../assets/images/B.jpg";
import image_user from "../assets/images/user.jpg";
import image_missing_B from "../assets/images/missing_B.jpg";
import sharedImg from "../assets/images/topic1.JPG";

const imageName = 'topic1.JPG';

function Main({ isMissedListener, rootURL }) {
    const [chatHistory, setChatHistory] = useState([
        { person: 'A', content: "なんで2人が話していると思う？" }
    ]);
    const [scains, setScains] = useState([]);
    const [showSubmitButton, setShowSubmitButton] = useState(true);
    const [speaker, setSpeaker] = useState('');
    const [switchMissedImage, setSwitchMissedImage] = useState(false);

    const chatHistoryRef = useRef(chatHistory);

    const addChatHistory = (currentStatement) => {
        return new Promise((resolve) => {
            setChatHistory((prevChatHistory) => {
                const updatedChatHistory = [...prevChatHistory, currentStatement];
                chatHistoryRef.current = updatedChatHistory;
                resolve(updatedChatHistory);
                return updatedChatHistory;
            });
        });
    };

    const addScains = (newScain) => {
        return new Promise((resolve) => {
            setScains((prevScains) => {
                const updatedScains = [...prevScains, newScain];
                resolve(updatedScains);
                return updatedScains;
            });
        });
    };

    const handleUserSendMessage = async (inputValue) => {
        setShowSubmitButton(false);
        const initialScainsLength = scains.length;
        try {
            const userStatement = { person: 'user', content: inputValue };
            let currentChatHistory = await addChatHistory(userStatement);
            let target = 'A';
            if (switchMissedImage) {
                target = inputValue.includes('Bさん') ? 'B' : 'A';
            }
            const payload = createPayload(currentChatHistory, imageName, false, target);

            const scainsUpdated = await Promise.all([
                handleScains(rootURL, currentChatHistory),
                handleImageTask(rootURL, payload)
            ]).then(results => results[0]);

            if (!switchMissedImage && scainsUpdated && scainsUpdated.length > initialScainsLength) {
                await handleImageTask(rootURL, createPayload(chatHistoryRef.current, imageName, true, 'A'));
                setTimeout(2000);
                await handleImageTask(rootURL, createPayload([chatHistoryRef.current[chatHistoryRef.current.length - 1]], imageName, false, 'B'));
            }
        } catch (error) {
            console.error('Error in handleUserSendMessage:', error);
        } finally {
            setShowSubmitButton(true);
        }
    };

    const createPayload = (chatHistory, imageName, isScains, person) => ({
        chat_history: chatHistory,
        image_name: imageName,
        is_scains: isScains,
        person: person,
    });

    const handleScains = (rootURL, currentChatHistory) => {
        return checkScains(rootURL, currentChatHistory)
            .then(result => {
                if (result.data) {
                    return addScains(result.data);  // ここで Promise を返す
                }
                return scains;  // 更新がない場合、現在の scains を返す
            })
            .catch(error => {
                console.error('Error in checkScains:', error.response ? error.response.data : error.message);
                return scains;
            });
    };

    const handleImageTask = async (rootURL, payload) => {
        try {
            const llmResponse = await generateImageTask(rootURL, payload);
            const taskId = llmResponse.data.task_id;

            return await pollResult(rootURL, taskId, async (result) => {
                return await addChatHistory({ person: payload.person, content: result });
            }, async (errorMessage) => {
                return await addChatHistory({ person: payload.person, content: errorMessage });
            });
        } catch (error) {
            throw error;
        }
    };

    // スクロール位置の設定
    useEffect(() => {
        const scrollArea = document.getElementById('scroll-area');
        if (scrollArea) {
            scrollArea.scrollTop = scrollArea.scrollHeight;
        }
    }, [chatHistoryRef.current]);

    useEffect(() => {
        if (speaker === 'B') {
            setSwitchMissedImage(true);
        }
    }, [speaker]);

    return (
        <section className="app-container">
            <div className="content">
                <div className="monitor-container">
                    <SharedMonitor
                        image_A={image_A}
                        image_B={image_B}
                        image_user={image_user}
                        image_missing_B={image_missing_B}
                        isMissedListener={isMissedListener}
                        sharedImg={sharedImg}
                        speaker={speaker}
                        switchMissedImage={switchMissedImage}
                    />
                </div>
                <div className="chats-content">
                    <div className="text-bold">
                        <span className="pink-color">ピンク：あなたの曖昧な発言</span>
                        <br></br>
                        <span className="orange-color">オレンジ：あなたの曖昧な発言を理解するために必要な情報</span>
                    </div>
                    <div className="chat-box-container">
                        <Chats
                            agent={'B'}
                            chats={chatHistory}
                            isCoreStatementSpoken={false}
                            isMissedListener={false}
                            isScainsMode={true}
                            onSpeakerChange={setSpeaker}
                            scains={scains}
                        />
                        <UserStatements
                            buttonVisible={showSubmitButton}
                            handleUserSendMessage={handleUserSendMessage}
                            isFreeChatMode={true}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Main;
