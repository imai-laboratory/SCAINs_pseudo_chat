import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loading = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <CircularProgress
                sx={{
                    color: 'green',
                    width: '200px !important',
                    height: '200px !important',
                }}
            />
        </Box>
    );
};

export default Loading;
