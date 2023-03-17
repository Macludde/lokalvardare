import { Button, CircularProgress, Paper, Typography } from '@mui/material'
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
} from 'react-firebase-hooks/firestore'
import { registerBong } from '../../api/bonga'

const firestore = getFirestore()
const Contestant: React.FC = () => {
    const { id } = useParams()
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
    const [user, userLoading] = useDocumentData(
        doc(firestore, 'users', contestant?.uid ?? 'never'),
        {
            transform: (val) => val as any,
        }
    )
    const [isLoading, setIsLoading] = React.useState(false)
    if (loading || bongsLoading || userLoading) {
        return <CircularProgress />
    }
    console.log(id)
    console.log(contestant)
    console.log(bongs)
    const bongCount = contestant?.bongCount
    const latestBong = bongs?.[0]?.timestamp?.toDate()
    return (
        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography variant="h4">{user?.name ?? 'Okänd person'}</Typography>
            <Typography fontWeight="bold" variant="h5">
                {bongCount} bongar
            </Typography>
            {latestBong && (
                <Typography fontWeight={500} variant="h6">
                    Bongade senast kl {latestBong.toLocaleTimeString()}
                </Typography>
            )}
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
        </Paper>
    )
}

export default Contestant
