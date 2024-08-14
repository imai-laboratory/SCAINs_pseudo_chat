import React, { useEffect, useState, useRef } from 'react';
import { Chats, SharedMonitor, UserStatements } from "../components";
import { checkScains } from "../api/checkScains";
import { generateImageTask } from "../api/imageTask";
import { pollResult } from "../utils/pollResult";
import image_A from "../assets/images/A.jpg";
import image_B from "../assets/images/B.jpg";
import image_user from "../assets/images/user.jpg";
import image_missing_B from "../assets/images/missing_B.jpg";
import sharedImg from "../assets/images/topic1.JPG";

function Main({ isMissedListener, rootURL }) {
    const [chatHistory, setChatHistory] = useState([
        { person: 'A', content: "なんで2人が話していると思う？" }
    ]);
    const [scains, setScains] = useState([]);
    const [speaker, setSpeaker] = useState('');
    const [switchMissedImage, setSwitchMissedImage] = useState(false);

    const addChatHistroy = (currentStatement) => {
        return new Promise((resolve) => {
            setChatHistory((prevChatHistory) => {
                const updatedChatHistory = [...prevChatHistory, currentStatement];
                resolve(updatedChatHistory);
                return updatedChatHistory;
            });
        });
    };

    const addScains = (newScain) => {
        setScains((prevScains) => [...prevScains, newScain]);
    };

    const handleUserSendMessage = async (inputValue) => {
        const userStatement = { person: 'user', content: inputValue };
        const currentChatHistroy = await addChatHistroy(userStatement);
        const imageName = 'topic1.JPG';

        const payload = {
            chat_history: currentChatHistroy,
            image_name: imageName,
        };

        try {
            const scainsPromise = checkScains(rootURL, currentChatHistroy).then(result => {
                if (result.data) {
                    addScains(result.data);
                }
            }).catch(error => {
                console.error('Error in checkScains:', error.response ? error.response.data : error.message);
            });

            const llmResponse = await generateImageTask(rootURL, payload);
            const taskId = llmResponse.data.task_id;

            await pollResult(rootURL, taskId, async (result) => {
                await addChatHistroy({ person: 'A', content: result });
            }, async (errorMessage) => {
                await addChatHistroy({ person: 'A', content: errorMessage });
            });

            await scainsPromise;
        } catch (error) {
            console.error('Error in handleUserSendMessage:', error);
        }
    };

    // スクロール位置の設定
    useEffect(() => {
        const scrollArea = document.getElementById('scroll-area');
        if (scrollArea) {
            scrollArea.scrollTop = scrollArea.scrollHeight;
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
                            buttonVisible={true}
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
