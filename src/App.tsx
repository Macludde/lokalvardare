import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material'
import React from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import theme from './styles/theme'

const App = () => {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <StyledThemeProvider theme={theme}>
                <div>App</div>
            </StyledThemeProvider>
        </MuiThemeProvider>
    )
}

export default App
