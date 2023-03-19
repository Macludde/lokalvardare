import { Box, Button, Paper, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { collection, getFirestore, query, where } from 'firebase/firestore'
import React from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { registerContestant } from '../../api/bonga'
import AuthGate from '../../components/AuthGate'
import useAuth from '../../hooks/useAuth'

const firestore = getFirestore()

const Bonga: React.FC = () => {
    const { uid, isLoggedIn } = useAuth()

    // Query the collection "contestants" for a document where uid = uid
    const [users, loading] = useCollectionData(
        query(collection(firestore, 'contestants'), where('uid', '==', uid)),
        {
            transform: (val) => val as any,
            idField: 'id',
        }
    )
    console.log(users)
    React.useEffect(() => {
        if (!loading && (users === undefined || users?.length === 0)) {
            registerContestant(uid)
        }
    }, [uid, loading, users])
    if (loading || users === undefined || users.length < 1) {
        return (
            <AuthGate>
                <CircularProgress />
            </AuthGate>
        )
    }
    const user = users[0]
    const { bongCount } = user
    console.log(user)
    const link = `${window.location.origin}/bonga/${user.id}`
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
                    <Typography variant="h4">{bongCount} bongar</Typography>
                    <a href={link}>{link}</a>
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
