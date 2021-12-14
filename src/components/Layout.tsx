import {
    Container,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { mainRoutes } from '../Router'

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
                        paddingY: 2,
                        paddingX: 2,
                        marginBottom: 4,
                    }}
                >
                    <Typography variant="h6" noWrap component="div">
                        Lokalvårdarna
                    </Typography>
                    <Typography variant="h6" noWrap component="div">
                        Lokalvårdarna
                    </Typography>
                </Grid>
                <Grid item xs>
                    <Paper>
                        <List disablePadding>
                            {mainRoutes.map((route) => (
                                <ListItem
                                    onClick={() => {
                                        navigate(route.path)
                                    }}
                                    button
                                    key={route.label}
                                    divider
                                    selected={
                                        location.pathname === `/${route.path}`
                                    }
                                >
                                    <ListItemText primary={route.label} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>{' '}
                <Grid item xs={8}>
                    {children}
                </Grid>
                <Grid item xs />
            </Grid>
        </Container>
    )
}

export default Layout
