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

export const Chat = ({text, person}) => {
    const isUser = (person === "user");
    const classes = isUser ? 'right-chat' : 'left-chat'

    return (
        <ListItem className={classes}>
            <ListItemAvatar>
                {isUser ? (
                    <Avatar alt={person} src={UserAvatar} />
                ) : (
                    <Avatar {...setAvatarColor(person)}  alt={person} src="/static/images/avatar/1.jpg" />
                )}
            </ListItemAvatar>
            <div className="chat-text sm">{text}</div>
        </ListItem>
    )
}

export default Chat
