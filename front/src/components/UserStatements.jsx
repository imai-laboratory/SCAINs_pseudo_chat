import React from "react";
import Button from '@mui/material/Button';

export const UserStatements = ({buttonVisible, userStatement, handleUserSendMessage}) => {
    return (
        <div className="user-statements-container">
            <div className="user-statement-content">
                <textarea className="user-statement" value={userStatement}>
                </textarea>
                <Button
                    variant="contained"
                    color="info"
                    size="large"
                    className="submit"
                    disabled={!buttonVisible}
                    onClick={handleUserSendMessage}
                >
                    送信
                </Button>
            </div>
        </div>
    )
}

export default UserStatements;
