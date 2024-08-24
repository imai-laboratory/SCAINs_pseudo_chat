import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import React, { useEffect } from 'react';
import UserAvatar from "../../assets/images/no-profile.png"
import A_icon from "../../assets/images/A_icon.png"
import B_icon from "../../assets/images/B_icon.png"
import {useTranslation} from "react-i18next";

export const Chat = ({agent, text, person, textClass, isCoreStatementSpoken, isMissedListener, isScainsIndex, onSpeakerChange, onSelectCore}) => {
    const isUser = (person === "user");
    const isAgent = (person === agent);
    const { t } = useTranslation();
    // let textClass;
    let icon;
    let speaker;
    const classes = isUser ? 'right-chat' : 'left-chat'

    // 負債：Homeでしか使わない
    // if (isMissedListener) {
    //     classes = isAgent ? 'right-chat' : 'left-chat'
    //     textClass = isScainsIndex && isCoreStatementSpoken ? 'scains-text md text-bold' : isAgent ? 'chat-user-text sm' : 'chat-text sm';
    // } else {
    //     classes = isUser ? 'right-chat' : 'left-chat'
    //     textClass = isScainsIndex && isCoreStatementSpoken ? 'scains-text md text-bold' : isUser ? 'chat-user-text sm' : 'chat-text sm';
    // }

    if (isUser) {
        icon = UserAvatar;
        speaker = t("speakers.you");
    } else if (isAgent) {
        icon = B_icon;
        speaker = t("speakers.B");
    } else {
        icon = A_icon;
        speaker = t("speakers.A");
    }

    useEffect(() => {
        onSpeakerChange(person);
    }, [person, onSpeakerChange]);

    return (
        <ListItem className={classes} onClick={onSelectCore}>
            <ListItemAvatar className="center">
                <Avatar alt={person} src={icon}/>
                <div className="sm">{speaker}</div>
            </ListItemAvatar>
            <div className={textClass} style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
        </ListItem>
    )
}

export default Chat
