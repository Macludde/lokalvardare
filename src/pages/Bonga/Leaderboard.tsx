import { Box, CircularProgress, Grid, Paper, Typography } from '@mui/material'
import {
    collection,
    collectionGroup,
    doc,
    getDocs,
    getFirestore,
    orderBy,
    query,
} from 'firebase/firestore'
import React, { useEffect } from 'react'
import {
    useCollectionData,
    useDocumentDataOnce,
} from 'react-firebase-hooks/firestore'

const firestore = getFirestore()

const DEFAULT_BONG_VALUE = 11.843
const DEFAULT_BASE_VALUE = 3000

const Leaderboard: React.FC = () => {
    const [gameSettings, gameSettingsLoading] = useDocumentDataOnce(
        doc(firestore, 'settings', 'bongCompetition')
    )
    const [users, usersLoading] = useCollectionData(
        collection(firestore, 'users'),
        {
            idField: 'uid',
        }
    )
    const [bongs, bongsLoading] = useCollectionData(
        query(
            collectionGroup(firestore, 'bongs'),
            orderBy('timestamp', 'desc')
        ),
        {
            idField: 'id',
        }
    )
    const [contestants, contestantsLoading] = useCollectionData(
        collection(firestore, 'contestants'),
        {
            idField: 'id',
        }
    )
    const bongsByUser = React.useMemo(
        () =>
            bongs?.reduce((acc, bong) => {
                if (acc[bong.uid] === undefined) {
                    acc[bong.uid] = 1
                } else {
                    acc[bong.uid] += 1
                }
                return acc
            }, {} as Record<string, number>),
        [bongs]
    )
    // Convert bongsByUser to an array of objects and sort on bongCount
    const sortedUsers = Object.entries(bongsByUser ?? {}).sort((a, b) => {
        return b[1] - a[1]
    })
    const latestBongs = bongs?.slice(0, 10) ?? []

    if (
        usersLoading ||
        bongsLoading ||
        gameSettingsLoading ||
        contestantsLoading
    ) {
        return <CircularProgress />
    }

    const largestBongCount = sortedUsers[0]?.[1]
    const totalBongCount = bongs?.length ?? 0
    const donation = Math.floor(
        (gameSettings?.baseValue ?? DEFAULT_BASE_VALUE) +
            (gameSettings?.bongValue ?? DEFAULT_BONG_VALUE) * totalBongCount
    )
    const formattedDonation = donation.toLocaleString('sv-SE', {
        style: 'currency',
        currency: 'SEK',
        maximumFractionDigits: 0,
    })

    return (
        <Grid container gap={2}>
            <Grid item xs={12}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Total donation
                    </Typography>
                    <Typography fontSize={64} fontWeight="bold">
                        {formattedDonation}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={9}>
                <Paper
                    sx={{
                        p: 2,
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Leaderboard
                    </Typography>
                    <Box
                        sx={{
                            height: sortedUsers.length * 52,
                            position: 'relative',
                        }}
                    >
                        {sortedUsers.map((user, index) => {
                            const [uid, bongCount] = user
                            const contestantId = contestants?.find(
                                (c) => c.uid === uid
                            )?.id
                            const userObject = users?.find((u) => u.uid === uid)
                            return (
                                <a href={`/bonga/${contestantId}`} key={uid}>
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
                                            color: 'white',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: `${
                                                    Math.floor(
                                                        (bongCount /
                                                            largestBongCount) *
                                                            50
                                                    ) + 50
                                                }%`,
                                                height: 48,
                                                backgroundColor:
                                                    'rgba(0,255,0,0.1)',
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
                        })}
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs sx={{ position: 'relative' }}>
                <Paper
                    sx={{
                        p: 2,
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
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
                            const formattedTimestamp =
                                timestamp.toLocaleTimeString('sv-SE', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                })
                            const userObject = users?.find(
                                (u) => u.uid === bong.uid
                            )
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
                                            backgroundColor:
                                                'rgba(255,255,255,0.1)',
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
            </Grid>
        </Grid>
    )
}

export default Leaderboard
