import React, {useState} from 'react';
import {Chats, SharedMonitor, UserStatements} from "./index";
import image_A from "../assets/images/A.jpg";
import image_B from "../assets/images/B.jpg";
import image_user from "../assets/images/user.jpg";
import image_missing_B from "../assets/images/missing_B.jpg";
import sharedImg from "../assets/images/topic1.JPG";

function Main({ isMissedListener, rootURL, user }) {
    const [chatHistory, setChatHistory] = useState([]);
    const [coreStatement, setCoreStatement] = useState('');
    const [scains, setScains] = useState({});
    const [speaker, setSpeaker] = useState('');
    const [switchMissedImage, setSwitchMissedImage] = useState(false);

    const handleUserSendMessage = async (e) => {

    };

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
                            userStatement={coreStatement}
                        />
                    </div>
                </div>
            </div>
        </section>
);
}

export default Main;
