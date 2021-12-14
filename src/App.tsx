import {
    Button,
    CssBaseline,
    ThemeProvider as MuiThemeProvider,
} from '@mui/material'
import React from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { signOut } from './api/firebase/auth'
import AuthGate from './components/AuthGate'
import Login from './pages/Login'
import theme from './styles/theme'

const App = () => {
    return (
        <MuiThemeProvider theme={theme.mui}>
            <CssBaseline />
            <StyledThemeProvider theme={theme.styled}>
                <AuthGate>
                    <div>Logged in</div>
                    <Button onClick={signOut}>Log out</Button>
                </AuthGate>
            </StyledThemeProvider>
        </MuiThemeProvider>
    )
}

export default App
