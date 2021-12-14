import { Box, CircularProgress, Fade } from '@mui/material'
import React from 'react'

const Loading = () => {
    return (
        <Box
            sx={{
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                paddingY: 16,
            }}
        >
            <Fade
                in
                style={{
                    transitionDelay: true ? '800ms' : '0ms',
                }}
                unmountOnExit
            >
                <CircularProgress />
            </Fade>
        </Box>
    )
}

export default Loading
