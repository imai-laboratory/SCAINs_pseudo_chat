import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import React from "react";
import UserAvatar from "../assets/images/no-profile.png"

function setAvatarColor(name) {
    return {
        sx: {
            bgcolor: name === "A" ? "#C5E1C5" : "#F2C55C",
        },
    };
}

export const Chat = ({text, person, isScains}) => {
    const isUser = (person === "user");
    const classes = isUser ? 'right-chat' : 'left-chat'
    const textClass = isScains ? 'scains-text md text-bold' : isUser ? 'chat-user-text sm' : 'chat-text sm';

    return (
        <ListItem className={classes}>
            <ListItemAvatar>
                {isUser ? (
                    <Avatar alt={person} src={UserAvatar}/>
                ) : (
                    <Avatar {...setAvatarColor(person)} alt={person}>{person}</Avatar>
                )}
            </ListItemAvatar>
            <div className={textClass}>{text}</div>
        </ListItem>
    )
}

export default Chat
