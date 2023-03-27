import { CircularProgress, Grid, Paper, Typography } from '@mui/material'
import {
    collectionGroup,
    doc,
    getFirestore,
    orderBy,
    query,
} from 'firebase/firestore'
import React from 'react'
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
    const [bongs, bongsLoading] = useCollectionData(
        collectionGroup(firestore, 'bongs')
    )
    if (bongsLoading || gameSettingsLoading) {
        return <CircularProgress />
    }

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
            <Grid item xs={6}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Prel Donation
                    </Typography>
                    <Typography fontSize={64} fontWeight="bold">
                        {formattedDonation}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Leaderboard
