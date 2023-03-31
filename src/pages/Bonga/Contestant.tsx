import { Box, CircularProgress, Paper, Typography } from '@mui/material'
import {
    collection,
    doc,
    getFirestore,
    orderBy,
    query,
} from 'firebase/firestore'
import React, { useEffect } from 'react'
import {
    useCollectionData,
    useDocumentData,
    useDocumentDataOnce,
} from 'react-firebase-hooks/firestore'
import { useParams } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const firestore = getFirestore()
const Contestant: React.FC = () => {
    const { id } = useParams()
    const { uid } = useAuth()
    const [user, userLoading] = useDocumentDataOnce(
        doc(firestore, 'users', uid ?? 'never')
    )
    const [contestant, loading] = useDocumentData(
        doc(firestore, 'contestants', id ?? 'never'),
        {
            transform: (val) => val as any,
        }
    )
    const [bongs, bongsLoading] = useCollectionData(
        query(
            collection(firestore, 'contestants', id ?? 'never', 'bongs'),
            orderBy('timestamp', 'desc')
        )
    )
    const [contestantUser, contestantUserLoading] = useDocumentData(
        doc(firestore, 'users', contestant?.uid ?? 'never'),
        {
            transform: (val) => val as any,
        }
    )
    const [minutesSinceLastBong, setMinutesSinceLastBong] = React.useState(0)
    // const [isLoading, setIsLoading] = React.useState(false)
    useEffect(() => {
        const interval = setInterval(() => {
            const latestBong: Date | undefined = bongs?.[0]?.timestamp?.toDate()
            if (latestBong) {
                const diff = new Date().getTime() - latestBong.getTime()
                const minutes = Math.floor(diff / 1000 / 60)
                setMinutesSinceLastBong(minutes)
            }
        }, 10000)
        return () => clearInterval(interval)
    }, [bongs])
    if (loading || bongsLoading || userLoading || contestantUserLoading) {
        return <CircularProgress />
    }
    console.log(contestantUser)
    const bongCount = contestant?.bongCount
    const pausedAt = contestant?.pausedAt?.toDate()
    const pausedUntil = pausedAt
        ? new Date(pausedAt.getTime() + 900_000) // 15 min
        : undefined
    const isPaused = pausedUntil && pausedUntil.getTime() > Date.now()
    const latestBong: Date | undefined = bongs?.[0]?.timestamp?.toDate()
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Paper
                sx={{
                    p: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                }}
            >
                <Typography variant="h4">
                    {contestantUser?.name ?? 'Okänd person'}
                </Typography>
                {isPaused && (
                    <Typography fontWeight={500} variant="h6" color="error">
                        PAUSAD till kl{' '}
                        {pausedUntil.toLocaleTimeString('sv-SE', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Typography>
                )}
                <Typography fontWeight="bold" variant="h5">
                    {bongCount} bongar
                </Typography>
                {latestBong && (
                    <Typography fontWeight={500} variant="h6">
                        Bongade senast kl {latestBong.toLocaleTimeString()}{' '}
                        <br />({minutesSinceLastBong} minuter sedan)
                    </Typography>
                )}
                {user?.isAdmin === true && pausedAt && (
                    <Typography color="error">
                        Pausad senast kl {pausedAt.toLocaleTimeString()}
                    </Typography>
                )}
                {/*
                {user?.isAdmin === true && (
                    <Stack direction="column" gap={10}>
                        <Button
                            variant="contained"
                            fullWidth
                            disabled={
                                isLoading ||
                                contestant?.uid === undefined ||
                                isPaused
                            }
                            onClick={async () => {
                                if (
                                    isLoading ||
                                    contestant?.uid === undefined
                                ) {
                                    return
                                }
                                setIsLoading(true)
                                await registerBong(id as string, contestant.uid)
                                setIsLoading(false)
                            }}
                        >
                            Registrera bong
                        </Button>
                        <Button
                            variant="contained"
                            fullWidth
                            color="error"
                            disabled={
                                isLoading ||
                                contestant?.uid === undefined ||
                                isPaused
                            }
                            onClick={async () => {
                                if (
                                    isLoading ||
                                    contestant?.uid === undefined
                                ) {
                                    return
                                }
                                setIsLoading(true)
                                await pauseContestant(
                                    id as string,
                                    contestant.uid
                                )
                                setIsLoading(false)
                            }}
                        >
                            Bongpausa
                        </Button>
                    </Stack>
                )
                        */}
            </Paper>
        </Box>
    )
}

export default Contestant
