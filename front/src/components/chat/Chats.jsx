import React, {useState} from "react";
import {Chat} from "../index";
import List from "@mui/material/List";
import { styled } from '@mui/material/styles';

const ChatsContainer = styled('div')({
    height: "100%",
    padding: "0",
    overflow: "auto",
    width: '100%',
    bgcolor: 'background.paper'
});


export const Chats = ({ agent, chats, isCoreStatementSpoken, isMissedListener, isScainsMode, onSpeakerChange, scains }) => {
    const [highlightedIndices, setHighlightedIndices] = useState({});
    const [selectedCoreIndex, setSelectedCoreIndex] = useState('');
    const handleSelectCore = (index) => {
        const selectedIndex = index + 1;
        const selectedScain = scains.find(scain => scain.core_index === selectedIndex);
        if (selectedScain) {
            setSelectedCoreIndex(selectedIndex);
            const newHighlightedIndices = {};
            selectedScain.scains_index.forEach(index => {
                newHighlightedIndices[index] = 'scains-text md text-bold';
            });
            setHighlightedIndices(newHighlightedIndices);
        } else {
            setSelectedCoreIndex(null);
            setHighlightedIndices({});
        }
    };

    return (
        <div className="chats-container">
            <ChatsContainer id={"scroll-area"}>
                <List>
                    {chats.map((chat, index) => {
                        const isScainsIndex = isScainsMode && scains.some(s => s.index === chat.index);
                        const currentIndex = index + 1;
                        const isCoreIndex = currentIndex === selectedCoreIndex;
                        const defaultTextClass =  chat.person === "user" ? 'chat-user-text sm' : 'chat-text sm';
                        const coreTextClass = isCoreIndex ? 'core-sentence-text md text-bold' : '';
                        const textClass = highlightedIndices[currentIndex] || coreTextClass || defaultTextClass;

                        return (
                            <Chat
                                agent={agent}
                                text={chat.content}
                                person={chat.person}
                                textClass={textClass}
                                key={index.toString()}
                                isCoreStatementSpoken={isCoreStatementSpoken}
                                isMissedListener={isMissedListener}
                                isScainsIndex={isScainsIndex}
                                scains={scains}
                                onSpeakerChange={onSpeakerChange}
                                onSelectCore={() => handleSelectCore(index)}
                            />
                        );
                    })}
                </List>
            </ChatsContainer>
        </div>
    )
}

export default Chats
