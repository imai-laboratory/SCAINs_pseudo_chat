import React from "react";
import {Chat} from "./index";
import List from "@mui/material/List";
import { styled } from '@mui/material/styles';

const ChatsContainer = styled('div')({
    height: "100%",
    padding: "0",
    overflow: "auto",
    width: '100%',
    bgcolor: 'background.paper'
});


export const Chats = ({ chats, isScainsMode, scains }) => {

    return (
        <div className="chats-container">
            <ChatsContainer id={"scroll-area"}>
                <List>
                    {chats.map((chat, index) => {
                        const isScainsIndex = isScainsMode && scains.some(s => s.index === chat.index);

                        return (
                            <Chat
                                text={chat.content}
                                person={chat.person}
                                key={index.toString()}
                                isScains={isScainsIndex}
                            />
                        );
                    })}
                </List>
            </ChatsContainer>
        </div>
    )
}

export default Chats
