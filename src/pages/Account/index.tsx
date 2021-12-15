import {
    Box,
    Button,
    CircularProgress,
    Fade,
    Paper,
    Slide,
    TextField,
    Typography,
} from '@mui/material'
import { doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import Grow from '@mui/material/Grow'
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
    const [nameLoading, setNameLoading] = useState(false)
    const loaderContainerRef = React.useRef(null)

    useEffect(() => {
        setNewName(account?.name ?? '')
    }, [loading])

    useEffect(() => {
        if (newName !== account?.name) {
            const delayLoadingIcon = setTimeout(() => {
                setNameLoading(true)
            }, 700)
            const delayNameUpdate = setTimeout(() => {
                updateDoc(userRef, {
                    name: newName,
                }).then(() => {
                    setNameLoading(false)
                })
            }, 1500)

            return () => {
                clearTimeout(delayLoadingIcon)
                clearTimeout(delayNameUpdate)
                setNameLoading(false)
            }
        }
        setNameLoading(false)
        return () => {
            setNameLoading(false)
        }
    }, [newName])

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
                        <Fade in={nameLoading}>
                            <CircularProgress />
                        </Fade>
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
