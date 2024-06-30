import React, { useState } from "react";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send'
export const UserStatements = ({ buttonVisible, isFreeChatMode, handleUserSendMessage, userStatement }) => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        handleUserSendMessage(inputValue);
        setInputValue('');
    };

    return (
        <div className="user-statements-container">
            <div className="user-statement-content">
                {isFreeChatMode
                    ? <textarea
                        className="user-statement"
                        value={inputValue}
                        onChange={handleChange}
                    />
                    : <textarea
                        className="user-statement"
                        value={userStatement}
                        readOnly
                    />
                }
                <Button
                    variant="contained"
                    color="info"
                    endIcon={<SendIcon />}
                    className="submit btn"
                    disabled={!buttonVisible}
                    onClick={handleSubmit}
                >
                    送信
                </Button>
            </div>
        </div>
    );
};

export default UserStatements;
