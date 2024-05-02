import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import React from "react";

export const Chat = ({text, person}) => {
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar alt={person} src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <div className="chat-text sm">{text}</div>
        </ListItem>
    )
}

export default Chat
