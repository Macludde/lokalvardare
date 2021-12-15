import { createTheme } from '@mui/material'

export const styledTheme = {}

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
})
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
})

type Theme = {
    mui: Record<'light' | 'dark', any>
    styled: any
}

const theme: Theme = {
    mui: {
        dark: darkTheme,
        light: lightTheme,
    },
    styled: styledTheme,
}

export default theme
