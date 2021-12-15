import { Button, Grid, Paper, Typography } from '@mui/material'
import React from 'react'
import { signInWithGoogle } from '../../api/firebase/auth'

const Login = () => {
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
        >
            <Paper
                elevation={3}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 4,
                }}
            >
                <Typography
                    sx={{
                        textAlign: 'center',
                        marginBottom: 4,
                        fontSize: 32,
                        fontWeight: 'bold',
                    }}
                >
                    Lokalvårdarna
                </Typography>
                <Button variant="contained" onClick={signInWithGoogle}>
                    Logga in med Google
                </Button>
            </Paper>
        </Grid>
    )
}

export default Login
