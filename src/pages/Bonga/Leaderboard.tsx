import { CircularProgress, Paper, Typography } from '@mui/material'
import {
    collection,
    collectionGroup,
    getDocs,
    getFirestore,
    orderBy,
    query,
} from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const firestore = getFirestore()
const Leaderboard: React.FC = () => {
    const [users, usersLoading] = useCollectionData(
        collection(firestore, 'users'),
        {
            idField: 'uid',
        }
    )
    const [bongs, bongsLoading] = useCollectionData(
        collectionGroup(firestore, 'bongs')
    )
    useEffect(() => {
        getDocs(
            query(
                collectionGroup(firestore, 'bongs'),
                orderBy('timestamp', 'desc')
            )
        ).then((snapshot) => {
            console.log(snapshot)
        })
    })
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

    if (usersLoading || bongsLoading) {
        return <CircularProgress />
    }

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h4">Leaderboard</Typography>
            {sortedUsers.map((user) => {
                const [uid, bongCount] = user
                const userObject = users?.find((u) => u.uid === uid)
                return (
                    <Typography key={uid}>
                        {userObject?.name}: {bongCount}
                    </Typography>
                )
            })}
        </Paper>
    )
}

export default Leaderboard
