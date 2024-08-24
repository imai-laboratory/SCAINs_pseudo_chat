import React, {useContext, useEffect, useRef, useState} from 'react';
import {Chats, SharedMonitor, UserStatements} from "../components";
import {checkScains} from "../api/checkScains";
import {generateImageTask, generateTask} from "../api/generateResponse";
import {pollImageResult, pollResult} from "../utils/pollResult";
import image_A from "../assets/images/A.jpg";
import image_B from "../assets/images/B.jpg";
import image_user from "../assets/images/user.jpg";
import image_missing_B from "../assets/images/missing_B.jpg";
import sharedImg from "../assets/images/topic1.JPG";
import {useTranslation} from "react-i18next";
import {LanguageContext} from "../context/LanguageContext";

const imageName = 'topic1.JPG';

function Main({ isMissedListener, rootURL }) {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const [chatHistory, setChatHistory] = useState([
        { person: 'A', content: t("chats.first") }
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
                const bPhrases = [t("phrases.B.first"), t("phrases.B.second"), t("phrases.B.third")];
                const aPhrases = [t("phrases.A.first"), t("phrases.A.second"), t("phrases.A.third")];

                if (bPhrases.some(phrase => inputValue.includes(phrase))) {
                    target = 'B';
                } else if (aPhrases.some(phrase => inputValue.includes(phrase))) {
                    target = 'A';
                } else {
                    target = chatHistoryRef.current[chatHistoryRef.current.length - 2]?.person || 'A';
                }
            }
            let payload;
            if (target === 'A') {
                payload = createPayloadWithImage(currentChatHistory, imageName, target);
            } else {
                const initScains = scains[0].scains_index;
                const omittedChatHistory = chatHistoryRef.current.filter((_, index) => !initScains.includes(index+1));
                payload = createPayload(omittedChatHistory, target);
            }
            const scainsUpdated = await handleScains(rootURL, currentChatHistory, language);

            if (!switchMissedImage && scainsUpdated && scainsUpdated.length > initialScainsLength) {
                await addChatHistory({ person: 'A', content: t("chats.scains") });
                await new Promise(resolve => setTimeout(resolve, 2000));
                const initScains = scainsUpdated[0].scains_index;
                const omittedChatHistory = chatHistoryRef.current.filter((_, index) => !initScains.includes(index+1));
                await handleTask(rootURL, createPayload(omittedChatHistory, 'B'));
            } else {
                if (target === 'A') {
                    await handleImageTask(rootURL, payload);
                } else {
                    await handleTask(rootURL, payload);
                }
            }
        } catch (error) {
            console.error('Error in handleUserSendMessage:', error);
        } finally {
            setShowSubmitButton(true);
        }
    };

    const createPayloadWithImage = (chatHistory, imageName, person) => ({
        chat_history: chatHistory,
        image_name: imageName,
        person: person,
        language: language,
    });

    const createPayload = (chatHistory, person) => ({
        chat_history: chatHistory,
        person: person,
        language: language,
    });

    const handleScains = (rootURL, currentChatHistory, language) => {
        return checkScains(rootURL, currentChatHistory, language)
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

            return await pollImageResult(rootURL, taskId, async (result) => {
                return await addChatHistory({ person: payload.person, content: result });
            }, async (errorMessage) => {
                return await addChatHistory({ person: payload.person, content: errorMessage });
            });
        } catch (error) {
            throw error;
        }
    };

    const handleTask = async (rootURL, payload) => {
        try {
            const llmResponse = await generateTask(rootURL, payload);
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
                        <span className="pink-color">{t('annotations.scains.description')}</span>
                        <br></br>
                        <span className="orange-color">{t('annotations.coreStatement.description')}</span>
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
