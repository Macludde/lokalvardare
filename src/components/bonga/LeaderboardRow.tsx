import { Box } from '@mui/material'
import React from 'react'

const LeaderboardRow: React.FC<{
    linkUrl: string
    index: number
    bongCount: number
    largestBongCount: number
    userObject: any
}> = ({ linkUrl, index, bongCount, largestBongCount, userObject }) => {
    return (
        <a href={linkUrl}>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.5s',
                    fontSize: 24,
                    fontWeight: '700',
                    height: 52,
                    position: 'absolute',
                    zIndex: 1000 - index,
                    top: index * 52,
                    color: 'text.primary',
                }}
            >
                <Box
                    sx={{
                        width: `${
                            Math.floor((bongCount / largestBongCount) * 50) + 50
                        }%`,
                        height: 48,
                        backgroundColor: 'rgba(0,255,0,0.1)',
                        position: 'absolute',
                        transition: 'all 0.5s',
                        borderRadius: 1,
                        zIndex: -1000,
                    }}
                />
                <Box
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flex: 1,
                        pl: 1,
                    }}
                >
                    {index}. {userObject?.name}
                </Box>
                <Box sx={{ pr: 1 }}>{bongCount}</Box>
            </Box>
        </a>
    )
}

export default LeaderboardRow
