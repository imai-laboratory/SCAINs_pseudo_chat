import React, {useCallback, useEffect, useState} from "react";
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
    const [firstCoreIndex, setFirstCoreIndex] = useState({});
    const [firstHighlightedIndices, setFirstHighlightedIndices] = useState({});
    const [highlightedIndices, setHighlightedIndices] = useState({});
    const [selectedCoreIndex, setSelectedCoreIndex] = useState('');

    const updateTextClasses = useCallback((selectedIndex = null) => {
        const targetScain = selectedIndex
            ? scains.find(scain => scain.core_index === selectedIndex)
            : scains.length > 0 ? scains[scains.length - 1] : null;

        if (targetScain) {
            setSelectedCoreIndex(targetScain.core_index);
            const newHighlightedIndices = {};
            const newFirstCoreIndex = {};
            if (scains.length === 1) {
                targetScain.scains_index.forEach(idx => {
                    newHighlightedIndices[idx] = 'scains-text__first md text-bold text-style';
                });
                newFirstCoreIndex[targetScain.core_index] = 'core-sentence-text__first md text-bold text-style';
                setFirstCoreIndex(newFirstCoreIndex);
                setFirstHighlightedIndices(newHighlightedIndices);
            } else {
                targetScain.scains_index.forEach(idx => {
                    newHighlightedIndices[idx] = 'scains-text sm text-style';
                });
                setHighlightedIndices(newHighlightedIndices);
            }
        } else {
            setSelectedCoreIndex(null);
            setHighlightedIndices({});
        }
    }, [scains]);

    const handleSelectCore = (index) => {
        const selectedIndex = index + 1;
        updateTextClasses(selectedIndex);
    };

    useEffect(() => {
        updateTextClasses();
    }, [scains, updateTextClasses]);

    return (
        <div className="chats-container">
            <ChatsContainer id={"scroll-area"}>
                <List>
                    {chats.map((chat, index) => {
                        const isScainsIndex = isScainsMode && scains.some(s => s.index === chat.index);
                        const currentIndex = index + 1;
                        const isCoreIndex = currentIndex === selectedCoreIndex;
                        const defaultTextClass =  chat.person === "user" ? 'chat-user-text sm text-style' : 'chat-text sm text-style';
                        const coreTextClass = isCoreIndex ? 'core-sentence-text sm text-style' : '';
                        const textClass = firstHighlightedIndices[currentIndex] || highlightedIndices[currentIndex] || firstCoreIndex[currentIndex] || coreTextClass || defaultTextClass;
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
