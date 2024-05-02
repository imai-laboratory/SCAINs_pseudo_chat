import React from "react";
import {Chat} from "./index";
import List from "@mui/material/List";

export const Chats = ({chats}) => {

    return (
        <div className="chats-container">
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {chats.map((chat, index) => {
                    return <Chat text={chat.content} person={chat.person} key={index.toString()}/>
                })}
            </List>
        </div>
    )
}

export default Chats
