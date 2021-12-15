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
    Tooltip,
    Typography,
} from '@mui/material'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import { mainRoutes } from '../Router'
import mop from '../assets/mop.png'
import { ThemeContext } from '../App'

const sidebarRoutes = mainRoutes.filter((route) => route.inSidebar)

const Layout: React.FC = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { toggleTheme } = React.useContext(ThemeContext)

    return (
        <Container>
            <Grid container columnSpacing={4} rowSpacing={4} marginBottom={8}>
                {/* Header */}
                <Grid
                    item
                    xs={12}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingY: 2,
                        paddingX: 2,
                        marginTop: 2,
                    }}
                >
                    {/* Left side */}
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
                    {/* Right side */}
                    <Box display="flex" flexDirection="row" alignItems="center">
                        <Tooltip title="Create new post">
                            <IconButton
                                onClick={() => navigate('/feed/create')}
                                sx={{ marginX: 1 }}
                            >
                                <AddCircleIcon
                                    style={{ height: 32, width: 32 }}
                                />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Toggle dark theme">
                            <IconButton
                                onClick={toggleTheme}
                                sx={{ marginX: 1 }}
                            >
                                <Brightness4Icon
                                    style={{ height: 32, width: 32 }}
                                />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Account">
                            <IconButton
                                onClick={() => navigate('account')}
                                sx={{ marginLeft: 1 }}
                            >
                                <AccountCircleIcon
                                    style={{ height: 32, width: 32 }}
                                />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Grid>
                {/* Sidebar */}
                <Grid item xs={12} md>
                    <Paper>
                        <List disablePadding>
                            {sidebarRoutes.map((route, index) => (
                                <ListItem
                                    onClick={() => navigate(route.path)}
                                    button
                                    key={route.label}
                                    divider={index !== sidebarRoutes.length - 1}
                                    selected={
                                        location.pathname === `/${route.path}`
                                    }
                                >
                                    <ListItemText primary={route.label} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                {/* Content */}
                <Grid item xs={12} md={6}>
                    {children}
                </Grid>
                <Grid item xs={12} md />
            </Grid>
        </Container>
    )
}

export default Layout
