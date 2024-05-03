import React from "react";
import Button from '@mui/material/Button';

export const UserStatements = ({buttonVisible, userStatement, handleUserSendMessage}) => {
    return (
        <div className="user-statements-container">
            {buttonVisible && (
                <Button
                    variant="contained"
                    color="info"
                    size="large"
                    className="user-statement"
                    onClick={handleUserSendMessage}
                >
                    {userStatement}
                </Button>
            )}
        </div>
    )
}

export default UserStatements;
