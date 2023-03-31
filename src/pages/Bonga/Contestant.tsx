import {
    Box,
    CircularProgress,
    Paper,
    Typography,
    useTheme,
} from '@mui/material'
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
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import useAuth from '../../hooks/useAuth'

const firestore = getFirestore()
const Contestant: React.FC = () => {
    const theme = useTheme()
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
    const bongData =
        [...(bongs ?? [])]
            .sort((a, b) => {
                return (
                    a.timestamp.toDate().getTime() -
                    b.timestamp.toDate().getTime()
                )
            })
            .reduce(
                (acc, bong) => {
                    const time = bong.timestamp.toDate().getTime()
                    if (acc.length === 0) {
                        return [{ time, bongs: 1 }]
                    }
                    return [
                        ...acc,
                        {
                            time,
                            bongs: acc[acc.length - 1].bongs,
                            timestamp: new Date(time).toLocaleTimeString(),
                        },
                        {
                            time,
                            bongs: acc[acc.length - 1].bongs + 1,
                            timestamp: new Date(time).toLocaleTimeString(),
                        },
                    ]
                },
                [
                    {
                        time: new Date('2023-03-29T17:00:00').getTime(),
                        bongs: 0,
                    },
                ] as {
                    time: number
                    bongs: number
                }[]
            ) ?? []
    if (bongData.length > 0) {
        bongData.push({
            time: bongData[bongData.length - 1].time + 600000,
            bongs: bongData[bongData.length - 1].bongs,
        })
    }
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
                <AreaChart
                    width={700}
                    height={200}
                    data={bongData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <XAxis
                        dataKey="time"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickCount={10}
                        tickFormatter={(time) => {
                            const date = new Date(time)
                            return date.toLocaleTimeString('sv-SE', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                        }}
                    />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip
                        labelFormatter={(time) => {
                            const date = new Date(time)
                            return date.toLocaleTimeString('sv-SE')
                        }}
                        labelStyle={{
                            fontWeight: 'bold',
                            color: theme.palette.primary.main,
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="bongs"
                        fillOpacity={1}
                        stroke={theme.palette.primary.main}
                        fill={theme.palette.primary.main}
                    />
                </AreaChart>
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
                                    id as string
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
