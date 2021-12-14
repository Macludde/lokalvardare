import {
    Button,
    CssBaseline,
    ThemeProvider as MuiThemeProvider,
} from '@mui/material'
import React from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { signOut } from './api/firebase/auth'
import AuthGate from './components/AuthGate'
import Layout from './components/Layout'
import theme from './styles/theme'
import Router from './Router'

const App = () => {
    return (
        <BrowserRouter>
            <MuiThemeProvider theme={theme.mui}>
                <CssBaseline />
                <StyledThemeProvider theme={theme.styled}>
                    <AuthGate>
                        <Layout>
                            <Router />
                        </Layout>
                    </AuthGate>
                </StyledThemeProvider>
            </MuiThemeProvider>
        </BrowserRouter>
    )
}

export default App
