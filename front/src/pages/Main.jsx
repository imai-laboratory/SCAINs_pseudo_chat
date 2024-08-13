import React, {useEffect, useState} from 'react';
import {Chats, SharedMonitor, UserStatements} from "../components";
import image_A from "../assets/images/A.jpg";
import image_B from "../assets/images/B.jpg";
import image_user from "../assets/images/user.jpg";
import image_missing_B from "../assets/images/missing_B.jpg";
import sharedImg from "../assets/images/topic1.JPG";
import axios from "axios";

function Main({ isMissedListener, rootURL, user }) {
    const [chatHistory, setChatHistory] = useState([
        { person: 'A', content: "なんで2人が話していると思う？" }
    ]);
    const [currentIndex, setCurrentIndex] = useState(1);
    const [scains, setScains] = useState([]);
    const [speaker, setSpeaker] = useState('');
    const [switchMissedImage, setSwitchMissedImage] = useState(false);

    const handleUserSendMessage = async (inputValue) => {
        const userStatement = { person: 'user', content: inputValue };
        const currentChatHistroy = await addChatHistroy(userStatement);
        const imageName = 'topic1.JPG';

        const payload = {
            chat_history: currentChatHistroy,
            image_name: imageName,
        };
        const llmResponse = await axios.post(`${rootURL}/api/generate-response/image-task`, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const taskId = llmResponse.data.task_id;
        await pollResult(taskId);
        //
        // setScains();
        //
        // const currentScains = scains
        //     .filter(entry => entry.core_index === currentIndex)
        //     .map(entry => entry.scains_index);

    }

    const pollResult = async (taskId) => {
        try {
            const result = await axios.get(`${rootURL}/api/generate-response/image-task/result/${taskId}`);
            if (result && result.data) {
                if (result.data.state === 'PENDING' || result.data.state === 'RETRY') {
                    setTimeout(() => pollResult(taskId), 2000); // 3秒後に再度リクエスト
                }  else if (result.data.state === 'FAILURE') {
                    await addChatHistroy({person: 'A', content: '申し訳ありません。タスクが失敗しました。'});
                } else if (result.data.result) {
                    await addChatHistroy({person: 'A', content: result.data.result});
                } else {
                    await addChatHistroy({person: 'A', content: '申し訳ありません。現在応答できません。'});
                }
            } else {
                throw new Error('Result or result.data is null or undefined');
            }
        } catch (error) {
            await addChatHistroy({person: 'A', content: '申し訳ありません。現在応答できません。'});
        }
    };

    const checkScains = async () => {
        try {
            const result = await axios.get(`${rootURL}/api/generate-response/check-scains`);
            addScains({ person: 'A', content: result.data.result });
        } catch (error) {
        }
    }

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
                            isCoreStatementSpoken={true}
                            isMissedListener={isMissedListener}
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
