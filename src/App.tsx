import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material'
import React, { createContext, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import AuthGate from './components/AuthGate'
import Layout from './components/Layout'
import Router from './Router'
import defaultTheme from './styles/theme'

export const ThemeContext = createContext<{
    toggleTheme: () => void
}>({
    toggleTheme: () => {},
})

const defaultThemeType = 'light'

const App = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(defaultThemeType)

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
    }

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            setTheme(savedTheme as 'light' | 'dark')
        }
    }, [])

    return (
        <BrowserRouter>
            <MuiThemeProvider theme={defaultTheme.mui[theme]}>
                <CssBaseline />
                <StyledThemeProvider theme={defaultTheme.styled}>
                    <ThemeContext.Provider value={{ toggleTheme }}>
                        <AuthGate>
                            <Layout>
                                <Router />
                            </Layout>
                        </AuthGate>
                    </ThemeContext.Provider>
                </StyledThemeProvider>
            </MuiThemeProvider>
        </BrowserRouter>
    )
}

export default App
