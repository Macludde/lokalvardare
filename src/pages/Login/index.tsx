import { Button, Grid, Paper, Typography } from '@mui/material'
import React from 'react'
import { signInWithGoogle, signInAnonymously } from '../../api/firebase/auth'

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
                    variant="h4"
                    sx={{
                        textAlign: 'center',
                        marginBottom: 2,
                        fontSize: 32,
                        fontWeight: 'bold',
                    }}
                >
                    Lokalvårdarna
                </Typography>
                <Button
                    variant="contained"
                    onClick={signInWithGoogle}
                    sx={{ marginY: 2 }}
                >
                    Logga in med Google
                </Button>
                <Button variant="contained" onClick={signInAnonymously}>
                    Logga in som Gäst
                </Button>
            </Paper>
        </Grid>
    )
}

export default Login
