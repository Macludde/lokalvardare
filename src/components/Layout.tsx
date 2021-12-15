import {
    Box,
    Button,
    Container,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import { mainRoutes } from '../Router'
import mop from '../assets/mop.png'
import { ThemeContext } from '../App'

const Layout: React.FC = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { toggleTheme } = React.useContext(ThemeContext)

    return (
        <Container>
            <Grid container columnSpacing={4}>
                <Grid
                    item
                    xs={12}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingY: 2,
                        paddingX: 2,
                        marginBottom: 4,
                    }}
                >
                    <Box display="flex" flexDirection="row" alignItems="center">
                        <img
                            src={mop}
                            alt="logo"
                            style={{ height: '64px', marginRight: 24 }}
                        />
                        <Typography sx={{ fontSize: 32 }}>
                            Lokalvårdarna
                        </Typography>
                    </Box>
                    <Box display="flex" flexDirection="row" alignItems="center">
                        <IconButton onClick={toggleTheme}>
                            <Brightness4Icon
                                style={{ height: 32, width: 32 }}
                            />
                        </IconButton>
                        <IconButton onClick={() => navigate('account')}>
                            <AccountCircleIcon
                                style={{ height: 32, width: 32 }}
                            />
                        </IconButton>
                    </Box>
                </Grid>
                <Grid item xs>
                    <Paper>
                        <List disablePadding>
                            {mainRoutes
                                .filter((route) => route.inSidebar)
                                .map((route) => (
                                    <ListItem
                                        onClick={() => navigate(route.path)}
                                        button
                                        key={route.label}
                                        divider
                                        selected={
                                            location.pathname ===
                                            `/${route.path}`
                                        }
                                    >
                                        <ListItemText primary={route.label} />
                                    </ListItem>
                                ))}
                        </List>
                    </Paper>
                </Grid>{' '}
                <Grid item xs={6}>
                    {children}
                </Grid>
                <Grid item xs />
            </Grid>
        </Container>
    )
}

export default Layout
