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
import { mainRoutes } from '../Router'
import mop from '../assets/mop.png'

const Layout: React.FC = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()
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
                    <IconButton onClick={() => navigate('account')}>
                        <AccountCircleIcon style={{ height: 48, width: 48 }} />
                    </IconButton>
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
