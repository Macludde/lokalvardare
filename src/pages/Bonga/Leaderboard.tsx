import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    Typography,
} from '@mui/material'
import { collection, getFirestore, query, where } from 'firebase/firestore'

import React from 'react'
import {
    useCollectionData,
    useCollectionDataOnce,
} from 'react-firebase-hooks/firestore'
import { Link } from 'react-router-dom'
import LeaderboardRow from '../../components/bonga/LeaderboardRow'
import useYearFromSearchParams from '../../hooks/useYearFromSearchParams'

const firestore = getFirestore()

const DEFAULT_BONG_VALUE = 0
const DEFAULT_BASE_VALUE = 0

const Leaderboard: React.FC = () => {
    const { yearToUse } = useYearFromSearchParams()

    const [allSettings, settingsLoading] = useCollectionDataOnce(
        collection(firestore, 'settings'),
        {
            idField: 'uid',
        }
    )
    const [users, usersLoading] = useCollectionData(
        collection(firestore, 'users'),
        {
            idField: 'uid',
        }
    )
    const [contestants, contestantsLoading] = useCollectionData(
        query(
            collection(firestore, 'contestants'),
            where(`bongCount_${yearToUse}`, '!=', null)
        ),
        {
            idField: 'id',
        }
    )
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
            return acc + (contestant[`bongCount_${yearToUse}`] ?? 0)
        }, 0) ?? 0

    const bongCompetitions =
        allSettings?.filter((setting) =>
            setting.uid.includes('bongCompetition')
        ) ?? []
    const years = bongCompetitions
        .map((comp) => {
            const year = parseInt(comp.uid.split('_')[1], 10)
            return Number(year)
        })
        .filter((year) => !Number.isNaN(year))
    years.sort((a, b) => b - a)
    const currentCompetition = bongCompetitions.find((comp) =>
        comp.uid.includes(yearToUse.toString())
    )
    if (!currentCompetition) {
        console.log('No game settings found, using defaults')
    }
    const donation = Math.floor(
        (currentCompetition?.baseValue ?? DEFAULT_BASE_VALUE) +
            (currentCompetition?.bongValue ?? DEFAULT_BONG_VALUE) *
                totalBongCount
    )
    const formattedDonation = donation.toLocaleString('sv-SE', {
        style: 'currency',
        currency: 'SEK',
        maximumFractionDigits: 0,
    })

    return (
        <Grid container gap={2}>
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    {settingsLoading ? (
                        <CircularProgress />
                    ) : (
                        years.map((year) => {
                            return (
                                <Link to={`/bonga/leaderboard?year=${year}`}>
                                    <Button
                                        variant={
                                            yearToUse === Number(year)
                                                ? 'contained'
                                                : 'outlined'
                                        }
                                    >
                                        {year}
                                    </Button>
                                </Link>
                            )
                        })
                    )}
                </Box>
            </Grid>
            <Grid item xs>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Antal bongar
                    </Typography>
                    <Typography fontSize={64} fontWeight="bold">
                        {settingsLoading || contestantsLoading ? (
                            <CircularProgress />
                        ) : (
                            totalBongCount
                        )}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Prel Donation
                    </Typography>
                    <Typography fontSize={64} fontWeight="bold">
                        {settingsLoading || contestantsLoading ? (
                            <CircularProgress />
                        ) : (
                            formattedDonation
                        )}
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
                            height:
                                contestantsLoading || usersLoading
                                    ? undefined
                                    : sortedUsers.length * 52,
                            position: 'relative',
                        }}
                    >
                        {contestantsLoading || usersLoading ? (
                            <CircularProgress />
                        ) : (
                            sortedUsers.map((user, index) => {
                                const [uid, bongCount] = user
                                const contestantId = contestants?.find(
                                    (c) => c.uid === uid
                                )?.id
                                const userObject = users?.find(
                                    (u) => u.uid === uid
                                )
                                return (
                                    <LeaderboardRow
                                        linkUrl={`/bonga/${contestantId}?year=${yearToUse}`}
                                        index={index}
                                        bongCount={bongCount}
                                        largestBongCount={largestBongCount}
                                        userObject={userObject}
                                    />
                                )
                            })
                        )}
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
