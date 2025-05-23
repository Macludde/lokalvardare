import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import {
    Box,
    Container,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Tooltip,
} from '@mui/material'
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ThemeContext } from '../App'
import logo from '../assets/logo.svg'
import useAuth from '../hooks/useAuth'
import { routes } from '../Router'
import useBongCompetitions from '../hooks/useBongCompetitions'

const sidebarRoutes = routes.filter((route) => route.inSidebar)

const Layout: React.FC = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { toggleTheme } = React.useContext(ThemeContext)
    const { isLoggedIn } = useAuth()
    const sidebarOpen = !location.pathname.includes('bonga')

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
                        <a href="/">
                            <img
                                src={logo}
                                alt="logo"
                                style={{ height: '128px', marginRight: 24 }}
                            />
                        </a>
                    </Box>
                    {/* Right side */}
                    <Box display="flex" flexDirection="row" alignItems="center">
                        {isLoggedIn && (
                            <Tooltip title="Skapa inlägg">
                                <IconButton
                                    component={Link}
                                    to="/feed/create"
                                    sx={{ marginX: 1 }}
                                >
                                    <AddCircleIcon
                                        style={{ height: 32, width: 32 }}
                                    />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="Toggla dark mode">
                            <IconButton
                                onClick={toggleTheme}
                                sx={{ marginX: 1 }}
                            >
                                <Brightness4Icon
                                    style={{ height: 32, width: 32 }}
                                />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Konto">
                            <IconButton
                                onClick={() => navigate('account')}
                                component={Link}
                                to="account"
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
                {sidebarOpen && (
                    <Grid item xs={12} md>
                        <Paper
                            style={{
                                zIndex: 5,
                                position: 'sticky',
                                top: 24,
                            }}
                        >
                            <List disablePadding>
                                {sidebarRoutes.map((route, index) => (
                                    <ListItem
                                        onClick={() => navigate(route.path)}
                                        button
                                        key={route.label}
                                        divider={
                                            index !== sidebarRoutes.length - 1
                                        }
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
                    </Grid>
                )}
                {/* Content */}
                <Grid item xs={12} md={sidebarOpen ? 6 : 12}>
                    {children}
                </Grid>
                {sidebarOpen && <Grid item xs={12} md />}
            </Grid>
        </Container>
    )
}

export default Layout
