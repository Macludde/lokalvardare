import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    Typography,
} from '@mui/material'
import {
    collection,
    collectionGroup,
    doc,
    getFirestore,
} from 'firebase/firestore'

import React from 'react'
import {
    useCollectionData,
    useDocumentDataOnce,
} from 'react-firebase-hooks/firestore'
import LeaderboardRow from '../../components/bonga/LeaderboardRow'
import useYearFromSearchParams from '../../hooks/useYearFromSearchParams'
import { clearOldField } from '../../api/bonga'

const firestore = getFirestore()

const DEFAULT_BONG_VALUE = 0
const DEFAULT_BASE_VALUE = 0

const Leaderboard: React.FC = () => {
    const { yearToUse } = useYearFromSearchParams()

    const [gameSettings, gameSettingsLoading] = useDocumentDataOnce(
        doc(firestore, 'settings', `bongCompetition_${yearToUse}`)
    )
    const [users, usersLoading] = useCollectionData(
        collection(firestore, 'users'),
        {
            idField: 'uid',
        }
    )
    const [contestants, contestantsLoading] = useCollectionData(
        collection(firestore, 'contestants'),
        {
            idField: 'id',
        }
    )
    const [bongs, bongsLoading] = useCollectionData(
        collectionGroup(firestore, 'bongs'),
        {
            idField: 'id',
        }
    )
    if (
        contestantsLoading ||
        usersLoading ||
        gameSettingsLoading ||
        bongsLoading
    ) {
        return <CircularProgress />
    }
    const bongsByUser: Record<string, number> =
        contestants?.reduce((acc, contestant) => {
            return {
                ...acc,
                [contestant.uid]: contestant[
                    `bongCount_${yearToUse}`
                ] as number,
            }
        }, {}) ?? {}
    // Convert bongsByUser to an array of objects and sort on bongCount
    const sortedUsers = Object.entries(bongsByUser ?? {}).sort((a, b) => {
        return b[1] - a[1]
    })

    const largestBongCount = sortedUsers[0]?.[1]
    const totalBongCount =
        contestants?.reduce((acc, contestant) => {
            return acc + contestant[`bongCount_${yearToUse}`]
        }, 0) ?? 0
    if (!gameSettings) {
        console.log('No game settings found, using defaults')
    }
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
            <Grid item xs>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Antal bongar
                    </Typography>
                    <Typography fontSize={64} fontWeight="bold">
                        {totalBongCount}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Prel Donation
                    </Typography>
                    <Typography fontSize={64} fontWeight="bold">
                        {formattedDonation}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12}>
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
                                <LeaderboardRow
                                    linkUrl={`/bonga/${contestantId}?year=${yearToUse}`}
                                    index={index}
                                    bongCount={bongCount}
                                    largestBongCount={largestBongCount}
                                    userObject={userObject}
                                />
                            )
                        })}
                    </Box>
                </Paper>
            </Grid>
            {/* Latest bongs */}
            {/* <Grid item xs sx={{ position: 'relative' }}>
                <LatestBongs users={users ?? []} latestBongs={latestBongs} />
            </Grid> */}
        </Grid>
    )
}
export default Leaderboard
