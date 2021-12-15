import { Box, Button, Fade, Paper, TextField, Typography } from '@mui/material'
import { doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { signOut } from '../../api/firebase/auth'
import { db } from '../../api/firebase/config'
import { User } from '../../api/firebase/schemes'
import useAuth from '../../hooks/useAuth'
import Loading from '../Loading'

const Account = () => {
    const user = useAuth()
    const userRef = doc(db, 'users', user?.uid ?? '')
    const [account, loading, error] = useDocumentData(userRef, {
        transform: (data) => data as User,
    })
    const [newName, setNewName] = useState(account?.name ?? '')
    const loaderContainerRef = React.useRef(null)

    useEffect(() => {
        setNewName(account?.name ?? '')
    }, [loading]) // eslint-disable-line

    // Add a loading animation if updating name takes too long
    useEffect(() => {
        if (newName !== account?.name) {
            const delayNameUpdate = setTimeout(() => {
                updateDoc(userRef, {
                    name: newName,
                })
            }, 500)

            return () => {
                clearTimeout(delayNameUpdate)
            }
        }
        return () => {}
    }, [newName]) // eslint-disable-line

    if (error) {
        console.error(error)
    }

    if (loading) {
        return <Loading />
    }

    return (
        <Fade in>
            <Paper sx={{ padding: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}
                >
                    <Typography variant="h4">Account</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginY: 4,
                            marginRight: 4,
                        }}
                        ref={loaderContainerRef}
                    >
                        <TextField
                            label="Name"
                            value={newName}
                            variant="outlined"
                            onChange={(e) => {
                                setNewName(e.currentTarget.value)
                            }}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={signOut}
                    >
                        Sign out
                    </Button>
                </Box>
            </Paper>
        </Fade>
    )
}

export default Account
