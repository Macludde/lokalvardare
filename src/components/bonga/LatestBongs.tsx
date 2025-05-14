import React from 'react'
import { Box, Paper, Typography } from '@mui/material'

function LatestBongs({
    latestBongs,
    users,
}: {
    latestBongs: any[]
    users: any[]
}) {
    return (
        <Paper
            sx={{
                p: 2,
            }}
        >
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                    mb: 2,
                }}
            >
                Senaste bongar
            </Typography>
            <Box
                sx={{
                    position: 'relative',
                    height: latestBongs.length * 32,
                }}
            >
                {latestBongs.map((bong, index) => {
                    const timestamp = bong.timestamp.toDate()
                    const formattedTimestamp = timestamp.toLocaleTimeString(
                        'sv-SE',
                        {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        }
                    )
                    const userObject = users?.find((u) => u.uid === bong.uid)
                    return (
                        <Box
                            key={bong.id}
                            sx={{
                                width: '100%',
                                px: 1,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                height: 32,
                                transition: 'all 0.5s',
                                position: 'absolute',
                                top: index * 32,
                                '&:nth-of-type(odd)': {
                                    backgroundColor: 'action.disabled',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    flex: 1,
                                }}
                            >
                                {userObject?.name}
                            </Box>
                            <Box>{formattedTimestamp}</Box>
                        </Box>
                    )
                })}
            </Box>
        </Paper>
    )
}

export default LatestBongs
