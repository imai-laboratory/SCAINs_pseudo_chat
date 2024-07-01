import React, {useEffect, useState} from 'react';
import '../assets/styles/Result.css'
import '../assets/styles/App.css'
import {Chats} from "./index";
import {useLocation, useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";

function Result({ isMissedListener, handleChangePerspective }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { agent, history1, history2, omittedChats, scains, speaker } = location.state || {};
    const [displayChats1, setDisplayChats1] = useState([]);
    const [displayChats2, setDisplayChats2] = useState([]);
    const [, setSpeaker] = useState('');
    const [isScainsMode, setIsScainsMode] = useState(false);

    useEffect(() => {
        setSpeaker(speaker);
    }, [speaker]);

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleChangeMode = () => {
        setIsScainsMode(!isScainsMode);
    };

    useEffect(() => {
        if (isMissedListener) {
            const newOmittedChats1 = omittedChats.slice(0, history1.length);
            setDisplayChats1(newOmittedChats1);
            const newOmittedChats2 = omittedChats.slice(0, history2.length);
            setDisplayChats2(newOmittedChats2);
        } else {
            setDisplayChats1(history1);
            setDisplayChats2(history2);
        }
    }, [history1, history2, isMissedListener, omittedChats]);

    return (
        <div className="result-container">
            <div className="btn-container">
                <Button
                    variant="contained"
                    color="error"
                    size="large"
                    className="submit"
                    onClick={handleBackToHome}
                >
                    戻る
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    size="large"
                    className="submit"
                    onClick={handleChangePerspective}
                >
                    {isMissedListener ? 'user視点に戻す' : 'Bさんの視点に切り替える'}
                </Button>
                <Button
                    variant="contained"
                    color="warning"
                    size="large"
                    className="text-bold md"
                    onClick={handleChangeMode}
                >
                    {isScainsMode ? 'SCAINsを非表示にする' : 'SCAINsを表示する'}
                </Button>
            </div>
            <div className="chats-history">
                <div className="turn-1">
                    <div className="xl text-bold title">1回目の対話履歴</div>
                    <div className="chat-box-container">
                    <Chats
                            agent={agent}
                            chats={displayChats1}
                            isMissedListener={isMissedListener}
                            isScainsMode={isScainsMode}
                            onSpeakerChange={setSpeaker}
                            scains={scains}
                        />
                        <div className="user-statements-container"></div>
                    </div>
                </div>
                <div className="turn-2">
                    <div className="xl text-bold title">2回目の対話履歴</div>
                    <div className="chat-box-container">
                        <Chats
                            agent={agent}
                            chats={displayChats2}
                            isMissedListener={isMissedListener}
                            isScainsMode={isScainsMode}
                            onSpeakerChange={setSpeaker}
                            scains={scains}
                        />
                        <div className="user-statements-container"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Result;