import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import React from "react";
import UserAvatar from "../assets/images/no-profile.png"
import A_icon from "../assets/images/A_icon.png"
import B_icon from "../assets/images/B_icon.png"

function setAvatarColor(name) {
    return {
        sx: {
            bgcolor: name === "A" ? "#C5E1C5" : "#F2C55C",
        },
    };
}

export const Chat = ({agent, text, person, isMissedListener, isScains}) => {
    const isUser = (person === "user");
    const isAgent = (person === agent);
    let classes;
    let textClass;
    let icon;
    let speaker;

    if (isMissedListener) {
        classes = isAgent ? 'right-chat' : 'left-chat'
        textClass = isScains ? 'scains-text md text-bold' : isAgent ? 'chat-user-text sm' : 'chat-text sm';
    } else {
        classes = isUser ? 'right-chat' : 'left-chat'
        textClass = isScains ? 'scains-text md text-bold' : isUser ? 'chat-user-text sm' : 'chat-text sm';
    }

    if (isUser) {
        icon = UserAvatar;
        speaker = 'あなた';
    } else if (person === 'A') {
        icon = A_icon;
        speaker = 'Aさん';
    } else if (person === agent) {
        icon = B_icon;
        speaker = 'Bさん';
    }

    return (
        <ListItem className={classes}>
            <ListItemAvatar>
                <Avatar alt={person} src={icon}/>
                <div className="sm">{speaker}</div>
            </ListItemAvatar>
            <div className={textClass}>{text}</div>
        </ListItem>
    )
}

export default Chat
