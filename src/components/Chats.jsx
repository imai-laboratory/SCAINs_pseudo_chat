import React from "react";
import {Chat} from "./index";
import List from "@mui/material/List";

export const Chats = () => {


    return (
        <div className="chats-container">
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <Chat />
            </List>
        </div>
    )
}

export default Chats
