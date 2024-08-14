import React, {useEffect, useState} from "react";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send'
export const UserStatements = ({ buttonVisible, isFreeChatMode, handleUserSendMessage, userStatement }) => {
    const [inputValue, setInputValue] = useState('');
    const [isShownButton, setIsShownButton] = useState(false);

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        handleUserSendMessage(inputValue);
        setInputValue('');
    };

    const handleKeyDown = (event) => {
        if (isShownButton && event.key === 'Enter' && event.metaKey) {
            event.preventDefault();
            setIsShownButton(false);
            handleSubmit();
        }
    };

    useEffect(() => {
        if (isFreeChatMode) {
            setIsShownButton(buttonVisible && inputValue !== '');
        } else {
            setIsShownButton(buttonVisible && userStatement !== null && userStatement !== '');
        }
    }, [buttonVisible, inputValue, isFreeChatMode, userStatement]);

    return (
        <div className="user-statements-container">
            <div className="user-statement-content">
                {isFreeChatMode
                    ? <textarea
                        className="user-statement"
                        value={inputValue}
                        onKeyDown={handleKeyDown}
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
                    disabled={!isShownButton}
                    onClick={handleSubmit}
                >
                    送信
                </Button>
            </div>
        </div>
    );
};

export default UserStatements;
