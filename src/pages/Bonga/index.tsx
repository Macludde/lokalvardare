import { Box, Button, Paper, Typography, useTheme } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { collection, getFirestore, query, where } from 'firebase/firestore'
import React from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import QRCode from 'react-qr-code'
import { registerContestant } from '../../api/bonga'
import AuthGate from '../../components/AuthGate'
import useAuth from '../../hooks/useAuth'
import logo from '../../assets/logo.svg'

const firestore = getFirestore()

const Bonga: React.FC = () => {
    const { uid } = useAuth()
    const theme = useTheme()

    // Query the collection "contestants" for a document where uid = uid
    const [contestants, loading] = useCollectionData(
        query(collection(firestore, 'contestants'), where('uid', '==', uid)),
        {
            transform: (val) => val as any,
            idField: 'id',
        }
    )
    React.useEffect(() => {
        if (
            !loading &&
            (contestants === undefined || contestants?.length === 0)
        ) {
            registerContestant(uid)
        }
    }, [uid, loading, contestants])
    if (loading || contestants === undefined || contestants.length < 1) {
        return (
            <AuthGate>
                <CircularProgress />
            </AuthGate>
        )
    }
    const contestant = contestants[0]
    const pausedAt = contestant.pausedAt?.toDate()
    const pausedUntil = pausedAt
        ? new Date(pausedAt.getTime() + 900_000) // 15 min
        : undefined
    const isPaused = pausedUntil && pausedUntil.getTime() > Date.now()
    const { bongCount } = contestant
    const link = `${window.location.origin}/bonga/${contestant.id}`
    return (
        <AuthGate>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    sx={{
                        p: 4,
                        gap: 8,
                        display: 'inline-flex',
                        flexDirection: 'column',
                        alignSelf: 'center',
                        maxWidth: '100%',
                    }}
                >
                    <Box>
                        <Typography variant="h4">{bongCount} bongar</Typography>
                        {isPaused && (
                            <Typography variant="h6" color="error">
                                Du får inte bonga förrän kl{' '}
                                {pausedUntil.toLocaleTimeString('sv-SE', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ position: 'relative' }}>
                        <a
                            href={link}
                            style={{
                                display: 'block',
                                padding: 16,
                                opacity: isPaused ? 0.05 : 1,
                            }}
                        >
                            <QRCode
                                value={link}
                                bgColor="transparent"
                                fgColor={theme.palette.text.primary}
                                level="M"
                                size={512}
                                style={{
                                    maxWidth: '100%',
                                    width: '100%',
                                    height: 'auto',
                                }}
                            />
                        </a>
                        {isPaused && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 64,
                                    bottom: 64,
                                    left: 64,
                                    right: 64,
                                    pointerEvents: 'none',
                                }}
                            >
                                <img
                                    src={logo}
                                    alt="logo"
                                    style={{ width: '100%' }}
                                />
                            </Box>
                        )}
                    </Box>
                </Paper>
                <Button
                    variant="contained"
                    sx={{ px: 8, mt: 4 }}
                    LinkComponent="a"
                    href="/bonga/leaderboard"
                >
                    Leaderboard
                </Button>
            </Box>
        </AuthGate>
    )
}

export default Bonga
