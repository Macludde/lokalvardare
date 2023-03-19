import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material'
import {
    collection,
    doc,
    getFirestore,
    orderBy,
    query,
} from 'firebase/firestore'
import React from 'react'
import { useParams } from 'react-router-dom'
import {
    useCollectionData,
    useDocumentData,
    useDocumentDataOnce,
} from 'react-firebase-hooks/firestore'
import { registerBong } from '../../api/bonga'
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
    const [isLoading, setIsLoading] = React.useState(false)
    if (loading || bongsLoading || userLoading || contestantUserLoading) {
        return <CircularProgress />
    }
    console.log(contestantUser)
    const bongCount = contestant?.bongCount
    const latestBong = bongs?.[0]?.timestamp?.toDate()
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
                <Typography fontWeight="bold" variant="h5">
                    {bongCount} bongar
                </Typography>
                {latestBong && (
                    <Typography fontWeight={500} variant="h6">
                        Bongade senast kl {latestBong.toLocaleTimeString()}
                    </Typography>
                )}
                {user?.isAdmin === true && (
                    <Button
                        variant="contained"
                        sx={{ marginX: 'auto' }}
                        disabled={isLoading || contestant?.uid === undefined}
                        onClick={async () => {
                            if (isLoading || contestant?.uid === undefined) {
                                return
                            }
                            setIsLoading(true)
                            await registerBong(id as string, contestant.uid)
                            setIsLoading(false)
                        }}
                    >
                        Registrera bong
                    </Button>
                )}
            </Paper>
        </Box>
    )
}

export default Contestant
